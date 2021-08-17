import {
  getCookie,
  setCookie,
  guid,
  isIos,
  isAndroid
} from "./utils"
var cnzzUrl = 'http://18.163.2.189:9010/user/app/cnzzinfo'
var GUID;
class AppDown {
  constructor($this) {
    this.vue = $this
    this.agent = localStorage['agent'] || localStorage['channelCode'];
    this.iosLink = ""
    this.androidLink = ""
    this.selfUrl = "http://47.243.60.225:7700"
  }
  initDown() {
    this.SendFinger();
  }
  initParmers() {
    let par1 = "channelCode=" + this.agent + "&channelDomain=" + location.origin
    let par2 = "channelDomain=" + location.origin
    return this.agent ?  par1 :  par2;
  }
  SendFinger() {
    let data={
      channelDomain:location.origin
    }
    if(this.agent) data.channelCode=this.agent
    this.vue.$store.dispatch('main/saveAgentSign', data).then(res => {})
  }
  // saveGUID() {
  //   if (getCookie('guid')) {
  //     GUID = getCookie('guid');
  //     this.cnzzPost(location.href, 0);
  //   } else {
  //     GUID = guid();
  //     setCookie("guid", GUID, "d1");
  //     this.cnzzPost(location.href, 1);
  //   }
  // }
  // cnzzPost(url, accessType) {
  //   var mcType = "win";
  //   if (isIos()) {
  //     mcType = "IOS"
  //   } else if (isAndroid()) {
  //     mcType = "Android"
  //   }
  //   var fdata = [{
  //       key: "mainAgentId",
  //       value: 210001
  //     },
  //     {
  //       key: "agentId",
  //       value: 210001
  //     },
  //     {
  //       key: "mcType",
  //       value: mcType
  //     },
  //     {
  //       key: "url",
  //       value: url
  //     },
  //     {
  //       key: "accessType",
  //       value: accessType
  //     },
  //   ]
  //   this.SendPost(cnzzUrl, fdata);
  // }
  // SendPost(url, data) {
  //   var formData = new FormData();
  //   for (var i = 0, n = data.length; i < n; i++) {
  //     formData.append(data[i].key, data[i].value);
  //   }
  //   var request = new XMLHttpRequest();
  //   request.onreadystatechange = function () {
  //     if (this.readyState == 4 && this.status == 200) {}
  //   };
  //   request.open('POST', url, true);
  //   request.send(formData);
  // }
  downloadGame(n) {
    if (n === void 0) {
      n = 0;
    }
    if (n == 0) {
      n = isIos() ? 2 : 1;
    }
    this.toDownload(n);
  }
  toDownload(n) {
    if (typeof (ClipboardMode) == 'undefined') {
      var ClipboardMode = 0;
    }
    switch (ClipboardMode) {
      case 1:
        this.copyTextToClipboard('weitjqm-' + this.initParmers());
        break;
      default:
        this.copyTextToClipboard("siteCode="+localStorage.siteCode+"&"+this.initParmers());
    }
    this.iosLink = JSON.parse(localStorage.getItem('config')).IOS.link
    this.androidLink = JSON.parse(localStorage.getItem('config')).Android.link
    if (n == 1) {
      if (isIos()) {
        this.iosDownload(this.iosLink);
      }
        else {
        this.MySelfInstall();
      }
    }
    if (n == 2) {
      this.iosDownload(this.iosLink);
    }

  }
  MySelfInstall() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        if (data && data.apk) {
          window.location = data.apk;
        } else if (this.androidLink) {
          window.location =  this.androidLink;
        }
      }
    };
    let data = this.agent ? "channel_code="+this.agent +"&channel_domain="+location.origin:"channel_domain="+location.origin
    request.open('GET', this.selfUrl + "?platform=" + localStorage.siteCode + "&" + data, true);
    request.send(null);
  }
  iosDownload(iosUrl) {
    setTimeout(function () {
      window.location = iosUrl;
    }, 0);
  }
  copyTextToClipboard(text) {
    console.log(text)
    var textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    try {
      document.execCommand('copy');
    } catch (err) {

    }
    document.body.removeChild(textArea);
  }
}
export default AppDown;
