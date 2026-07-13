from datetime import date


def get_next_month_start(year: int, month: int) -> date:
    if month == 12:
        return date(year + 1, 1, 1)

    return date(year, month + 1, 1)
