
module.exports = {
  DB_URI: "mongodb://localhost/yb",
  BACKUP_PATH: "./backup_db",
  // BETBURGER_API_TOKEN: "71b64e9a6c8c04f1d07709ef9c872e98",
  // BETBURGER_FILTER_ID: 374153,
  MAX_LOG_LENGTH: 500,
  // ACCOUNT_PRICE: 20,
  // ACCOUNT_WITHDRAW_COMMISSION: 0.05,
  // 페이지당 계정 수
  ACCOUNT_LIST_COUNT_PER_PAGE: 10,
  // 페이지당 프록시 수
  PROXY_LIST_COUNT_PER_PAGE: 10,
  // 페이지 수
  PAGE_COUNT: 10,


  //// db setting에 정보가 없으면 이것을 쓴다.
  // 프로그램 기본 제한수
  PROGRAM_COUNT: 2,
  // 프로그램 당 기본 브라우져 제한수
  BROWSER_COUNT: 6
}
