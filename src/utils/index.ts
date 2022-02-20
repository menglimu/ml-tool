/*
 * @Author: ??
 * @Date: 2019-11-08 09:59:54
 * @LastEditors: wenlin
 * @LastEditTime: 2021-01-10 21:47:16
 * @Description: 提供一些公用的基础方法
 * js-cookie：操作cookie的js库  https://www.npmjs.com/package/js-cookie
 * sockjs：websocket需后端同时使用   https://www.npmjs.com/package/sockjs-client
 */

/**
 * 将日期按格式进行格式化为字符串
 * @param time 需要格式的日期
 * @param format 格式化的格式
 */
export function parseTime(time: Date | number | string, format = "yyyy-mm-dd hh:ii:ss") {
  if (!time) return "";
  let date: Date;
  if (time instanceof Date) {
    date = time;
  } else {
    let _time = typeof time === "string" ? parseInt(time, 10) : time;
    if (String(_time).length === 10) _time = _time * 1000;
    date = new Date(_time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/(y|m|d|h|i|s|a)+/gi, (result, key) => {
    let value = formatObj[key];
    if (key === "a") return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}
/**
 * 将时间格式化为中午，如刚刚，**分钟前
 * @param time 时间
 * @param format 自定义格式的格式内容
 */
export function formatTime(time: string | number | Date, format?: string) {
  let date: Date = null;
  if (time instanceof Date) {
    date = time;
  } else {
    date = new Date(Number(time));
  }

  const diff = (Date.now() - date.getTime()) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (format) {
    return parseTime(date, format);
  } else {
    return date.getMonth() + 1 + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分";
  }
}
// 根据返回的blob流来下载文件
export function createDownloadLink(res: any) {
  const downloadLink = window.document.createElement("a");
  let fileName = res?.headers?.["content-disposition"]
    ?.split(";")[1]
    .split("filename=")[1]
    .replace(/^\"|\"$/g, "");
  try {
    fileName = decodeURIComponent(fileName);
  } catch (e) {}
  const fileUrl = res.data && window.URL.createObjectURL(res.data);
  downloadLink.href = fileUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(fileUrl);
}

/**
 * @description: 获取URL后的参数值
 * @param {string} 参数名
 * @return: 值或null
 */
export function GetQueryString(name: string) {
  // const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  // const r = window.location.search.substr(1).match(reg)
  // if (r != null) return r[2]
  // return null
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let search = window.location.search;
  if (!search) {
    search = `?${window.location.href.split("?")[1]}`;
  }
  const r = search.substr(1).match(reg);
  if (r) return r[2];
  return null;
}

// TODO: 完善
// eslint-disable-next-line max-params
export function findValByKey(data: any, val: any, key = "id", childrenKey = "children"): any {
  // for (const i in data) {
  //   if (data[i][key] && data[i][key] === val) {
  //     return data[i];
  //   }
  //   if (data[i][childrenKey] && data[i][childrenKey].length) {
  //     const result = findValByKey(data[i][childrenKey], val, key, childrenKey);
  //     if (result !== undefined) return result;
  //   }
  // }
}

/**
 * 生成随机id
 */
export function createRandomId() {
  return (
    "id-" +
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    "-" +
    new Date().getTime() +
    "-" +
    Math.random().toString().substr(2, 5)
  );
}

/**
 * @description: 判断值是否为空,包括空[],{},'',不包括0
 * @param {any} str 所需判断的值
 * @return {Boolean} 是否为空
 */
export function isNull(str: any): boolean {
  if (str === undefined || str === null || str === "") {
    return true;
  } else if (Array.isArray(str) && str.length === 0) {
    return true;
  } else if (typeof str === "object" && Object.keys(str).length === 0) {
    return true;
  }
  return false;
}
/**   TODO: 优化 in
 * @description: 判断一个对象时候符合judge的条件。所有值相等是为true，任一值不相等返回false
 * @param {AnyObj} judge 条件
 * @param {AnyObj} data 数据
 * @return {Boolean}
 */
export function getJudge(judge: Record<string, any>, data: Record<string, any>): boolean {
  for (const key in judge) {
    if (data[key] !== judge[key]) {
      return false;
    }
  }
  return true;
}
/**
 * 直接播放语音提示
 * @param url 语音地址 或者 require('xxx')
 * @param loop 循环播放
 * @returns HTMLAudioElement
 */
export function playAudio(url: string, loop = false) {
  const audio = new Audio(url);
  audio.play();
  if (loop) {
    audio.onended = () => {
      audio.play();
    };
  }
  return audio;
}
