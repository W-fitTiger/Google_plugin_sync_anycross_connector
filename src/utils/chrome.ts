
declare const chrome: any
const LOG_URL = "accounts/page/login?app_id=39&no_trap=1&redirect_uri=https%3A%2F%2Fanycross.feishu-boe.cn%2F"
enum LogDomain {
  type = "boe"
}

export function customStorage() {
  if (process.env.NODE_ENV === "development") {
    return {
      set: localStorage.setItem,
      get: localStorage.setItem
    }
  } else {
    return {
      set: chrome.storage.session.set,
      get: chrome.storage.session.get
    }
  }
}
export async function customCookie(domain: string) {
  let cookie = ""
  await chrome.cookies.getAll({ domain }, (cookie: string) => {
    cookie = cookie
  })
  return cookie
}

export function toLog(type: string) {
  const baseUrl = type === LogDomain.type ? "https://anycross.feishu-boe.cn" : "https://anycross.feishu.cn"

  if (process.env.NODE_ENV === "development") {
    return chrome.tabs.create(
      {
        url: `${baseUrl}/${LOG_URL}`
      },
      (e: any) => {
        console.log(e);
      },
    )
  } else {
    return window.open(`${baseUrl}/${LOG_URL}`)
  }

}