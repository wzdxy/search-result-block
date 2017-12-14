window.onload = function () {
  let enableBtn = document.getElementById('enable-btn');
  let disableBtn = document.getElementById('disable-btn')
  let statusInfo=document.getElementById('status')
  chrome.storage.sync.get({
    extensionEnabled: true,
  }, (opt) => {
    setBtnStatus(opt.extensionEnabled);
  })

  enableBtn.addEventListener('click', function (e) {
    chrome.tabs.executeScript({ code: 'searchResultBlock.hide()' })
    chrome.storage.sync.set({
      extensionEnabled: true,
    }, () => {})
    setBtnStatus(true);
  })

  disableBtn.addEventListener('click', function (e) {
    chrome.tabs.executeScript({ code: ';searchResultBlock.show()' })
    chrome.storage.sync.set({
      extensionEnabled: false,
    }, () => {})
    setBtnStatus(false);
  })

  function setBtnStatus(enabled) {
    if (enabled) {
      enableBtn.setAttribute('disabled', 'disabled');
      disableBtn.removeAttribute('disabled')
      statusInfo.innerHTML='ENABLED'
      statusInfo.classList.add('enabled');
      statusInfo.classList.remove('disabled');
    } else {
      disableBtn.setAttribute('disabled', 'disabled');
      enableBtn.removeAttribute('disabled')
      statusInfo.innerHTML='DISABLED'
      statusInfo.classList.add('disabled');
      statusInfo.classList.remove('enabled');
    }
  }
}