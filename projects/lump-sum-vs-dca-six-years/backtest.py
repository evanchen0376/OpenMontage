"""Reproducible comparison from CSI's official total-return index series.

Uses the fixed 2026-09-29 cutoff selected for this film.
The CSI endpoint sometimes prepends the requested non-trading start date with
the first actual trading day's data. The experiment begins on 2020-10-09.
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "artifacts"
START = "20201009"
INDEXES = {
    "沪深300": "H00300",
    "中证500": "H00905",
    "中证红利低波动": "H20269",
}
CONTRIBUTIONS_CENTS = [138889] * 71 + [138881]


def year_fraction(start: date, end: date) -> float:
    return (end - start).days / 365.25


def xirr(flows: list[tuple[date, float]]) -> float:
    origin = flows[0][0]

    def npv(rate: float) -> float:
        return sum(amount / (1 + rate) ** year_fraction(origin, when)
                   for when, amount in flows)

    low, high = -0.999, 1.0
    while npv(low) * npv(high) > 0:
        high = 2 * high + 1
        if high > 1_000_000:
            raise ValueError("XIRR root not bracketed")
    for _ in range(100):
        middle = (low + high) / 2
        if npv(low) * npv(middle) <= 0:
            high = middle
        else:
            low = middle
    return (low + high) / 2


def load_series(code: str) -> list[dict]:
    files = sorted(DATA_DIR.glob(f"csi-{code.lower()}-*.json"))
    if not files:
        raise ValueError(f"No source file for {code}")
    response = json.loads(files[-1].read_text())
    if response.get("code") != "200":
        raise ValueError(f"CSI request failed for {code}")
    rows = response["data"]
    if rows[0]["tradeDate"] == "20201001":
        if rows[0]["close"] != rows[1]["close"] or rows[1]["tradeDate"] != START:
            raise ValueError(f"Unexpected synthetic start row for {code}")
        rows = rows[1:]
    if rows[0]["tradeDate"] != START:
        raise ValueError(f"Wrong start date for {code}")
    if any(row["indexCode"] != code or row["close"] <= 0 for row in rows):
        raise ValueError(f"Invalid CSI data for {code}")
    dates = [row["tradeDate"] for row in rows]
    if dates != sorted(set(dates)):
        raise ValueError(f"Duplicate or unordered CSI dates for {code}")
    return rows


def calculate(rows: list[dict]) -> dict:
    buy_dates = {}
    for row in rows:
        month = row["tradeDate"][:6]
        buy_dates.setdefault(month, row["tradeDate"])
    if len(buy_dates) != 72 or list(buy_dates)[0] != "202010" or list(buy_dates)[-1] != "202609":
        raise ValueError("Expected 72 monthly purchase dates, Oct 2020–Sep 2026")

    first_level = rows[0]["close"]
    lump_units = 100000 / first_level
    dca_units = 0.0
    contributed_cents = 0
    purchase_index = 0
    cash_flows = []
    path = []
    worst_lump = (0.0, START)
    worst_dca = (0.0, START)
    worst_lump_yuan = (0.0, START)
    worst_dca_yuan = (0.0, START)

    for row in rows:
        trade_date = row["tradeDate"]
        level = row["close"]
        if trade_date in buy_dates.values():
            cents = CONTRIBUTIONS_CENTS[purchase_index]
            purchase_index += 1
            contributed_cents += cents
            dca_units += (cents / 100) / level
            cash_flows.append((date.fromisoformat(f"{trade_date[:4]}-{trade_date[4:6]}-{trade_date[6:]}"), -(cents / 100)))
        lump_value = lump_units * level
        dca_value = dca_units * level
        dca_principal = contributed_cents / 100
        lump_loss_pct = lump_value / 100000 - 1
        dca_loss_pct = dca_value / dca_principal - 1
        if lump_loss_pct < worst_lump[0]:
            worst_lump = (lump_loss_pct, trade_date)
        if dca_loss_pct < worst_dca[0]:
            worst_dca = (dca_loss_pct, trade_date)
        if lump_value - 100000 < worst_lump_yuan[0]:
            worst_lump_yuan = (lump_value - 100000, trade_date)
        if dca_value - dca_principal < worst_dca_yuan[0]:
            worst_dca_yuan = (dca_value - dca_principal, trade_date)
        path.append({"date": trade_date, "index_close": level,
                     "lump_value": round(lump_value, 2),
                     "dca_value": round(dca_value, 2),
                     "dca_contributed": round(dca_principal, 2)})

    if purchase_index != 72 or contributed_cents != 10000000:
        raise ValueError("Contribution count or total is wrong")
    end = date.fromisoformat(f"{rows[-1]['tradeDate'][:4]}-{rows[-1]['tradeDate'][4:6]}-{rows[-1]['tradeDate'][6:]}")
    cash_flows.append((end, dca_value))
    return {
        "start_date": START,
        "end_date": rows[-1]["tradeDate"],
        "observations": len(rows),
        "buy_dates": list(buy_dates.values()),
        "monthly_contribution_yuan": {"months_1_to_71": 1388.89, "month_72": 1388.81},
        "lump": {"final_value_yuan": round(lump_value, 2),
                 "profit_yuan": round(lump_value - 100000, 2),
                 "total_return_pct": round((lump_value / 100000 - 1) * 100, 4),
                 "annualized_return_pct": round(((lump_value / 100000) ** (1 / year_fraction(date(2020, 10, 9), end)) - 1) * 100, 4),
                 "maximum_floating_loss_pct_of_contributions": round(worst_lump[0] * 100, 4),
                 "maximum_floating_loss_pct_date": worst_lump[1],
                 "maximum_floating_loss_yuan": round(worst_lump_yuan[0], 2),
                 "maximum_floating_loss_yuan_date": worst_lump_yuan[1]},
        "dca": {"final_value_yuan": round(dca_value, 2),
                "profit_yuan": round(dca_value - 100000, 2),
                "total_return_pct": round((dca_value / 100000 - 1) * 100, 4),
                "xirr_pct": round(xirr(cash_flows) * 100, 4),
                "maximum_floating_loss_pct_of_contributions": round(worst_dca[0] * 100, 4),
                "maximum_floating_loss_pct_date": worst_dca[1],
                "maximum_floating_loss_yuan": round(worst_dca_yuan[0], 2),
                "maximum_floating_loss_yuan_date": worst_dca_yuan[1]},
        "path": path,
    }


def main() -> None:
    results = {name: calculate(load_series(code)) for name, code in INDEXES.items()}
    endpoints = {value["end_date"] for value in results.values()}
    calendars = {tuple(value["buy_dates"]) for value in results.values()}
    if len(endpoints) != 1 or len(calendars) != 1:
        raise ValueError("Index data have mismatched dates")
    selected_cutoff = "20260929"
    if next(iter(endpoints)) != selected_cutoff:
        raise ValueError(f"Expected fixed cutoff {selected_cutoff}, got {endpoints}")
    output = {
        "status": "final_for_fixed_2026_09_29_cutoff",
        "source": "中证指数有限公司，官方日频历史行情接口",
        "source_url_template": f"https://www.csindex.com.cn/csindex-home/perf/index-perf?indexCode={{code}}&startDate=20201001&endDate={next(iter(endpoints))}",
        "method": "Index total-return close; buy at first trading day's close each month; no fees, tax, or tracking error; floating loss = account value / cumulative contributions - 1; DCA annualized = XIRR.",
        "results": results,
    }
    path = DATA_DIR / "backtest-fixed-20260929.json"
    path.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    chart_path = ROOT / "hyperframes" / "assets" / "chart-data.js"
    chart_path.parent.mkdir(parents=True, exist_ok=True)
    chart_data = {
        name: {"code": INDEXES[name], "path": value["path"],
               "lump": value["lump"], "dca": value["dca"]}
        for name, value in results.items()
    }
    chart_path.write_text("window.CHART_DATA = " + json.dumps(chart_data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    for name, value in results.items():
        print(name, value["end_date"], value["lump"], value["dca"])
    print("Wrote", path)
    print("Wrote", chart_path)


if __name__ == "__main__":
    main()
