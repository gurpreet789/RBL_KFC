﻿// Must be first. IE10 mobile viewport fix
if ("-ms-user-select" in document.documentElement.style && navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    var mq = '@@-ms-viewport{width:auto!important}';
    msViewportStyle.appendChild(document.createTextNode(mq));
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}