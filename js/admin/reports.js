import{
getAnalytics
}
from "../services/analytics.js";

import{
getReportSchedule,
saveReportSchedule,
exportAnalyticsCsv,
generateReportSummary
}
from "../services/reports.js";

const csvBtn=
document.getElementById(
"exportCsvBtn"
);

const pdfBtn=
document.getElementById(
"exportPdfBtn"
);

const schedule=
document.getElementById(
"scheduleFrequency"
);

const saveBtn=
document.getElementById(
"saveScheduleBtn"
);

const summary=
document.getElementById(
"reportSummary"
);

async function load(){

const analytics=
await getAnalytics();

summary.innerHTML=
generateReportSummary(
analytics
);

schedule.value=
getReportSchedule();

}

csvBtn.onclick=
async()=>{

const analytics=
await getAnalytics();

exportAnalyticsCsv(
analytics
);

};

pdfBtn.onclick=
()=>{

window.print();

};

saveBtn.onclick=
()=>{

saveReportSchedule(
schedule.value
);

alert(
"Report schedule saved."
);

};

load();