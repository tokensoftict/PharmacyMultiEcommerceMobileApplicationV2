
export default function formatDate(date: any) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = monthsOfYear[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    // Get the suffix for the day of the month (st, nd, rd, th)
    let daySuffix = "th";
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
        daySuffix = "st";
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
        daySuffix = "nd";
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
        daySuffix = "rd";
    }

    // Return the formatted date
    return `${dayOfWeek}, ${month} ${dayOfMonth}${daySuffix}, ${year}`;
}
