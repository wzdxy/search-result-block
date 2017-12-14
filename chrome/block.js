this.Element && function (ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.matchesSelector || ElementPrototype.webkitMatchesSelector || ElementPrototype.msMatchesSelector || function (selector) {
        var node = this
            , nodes = (node.parentNode || node.document).querySelectorAll(selector)
            , i = -1;
        while (nodes[++i] && nodes[i] != node)
            ;
        return !!nodes[i];
    }
}(Element.prototype);

// closest polyfill
this.Element && function (ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest || function (selector) {
        var el = this;
        while (el.matches && !el.matches(selector))
            el = el.parentNode;
        return el.matches ? el : null;
    }
}(Element.prototype);

searchResultBlock = {
    status: {
        enabled: false
    },
    option: {},
    init: function () {
        this.targetResult = [];                                 // 要处理的搜索结果
        this.engineName = this.currentEnginesName();
        this.SearchResultInfoEle = {                            // 获取搜索结果信息显示
            google: document.getElementById('resultStats'),
            baidu: document.getElementsByClassName('nums')[0],
            bing:document.getElementsByClassName('sb_count')[0],
        }[this.engineName];
        this.SearchResultBox = {                                // 搜索结果整体容器
            google: document.getElementById('ires'),
            baidu: document.getElementById('wrapper_wrapper'),
            bing:document.getElementById('b_results'),
        }[this.engineName];
        this.blockedInfoSpan = document.createElement('span');      // 创建屏蔽信息显示
        this.blockedInfoSpan.setAttribute('id', 'user-blocked-search-result-info-ele');
        let existInfo = document.getElementById('user-blocked-search-result-info-ele');
        if (existInfo) existInfo.parentNode.removeChild(existInfo);
        this.SearchResultInfoEle.appendChild(this.blockedInfoSpan);   // 把过滤结果加到搜索引擎信息后面

        let refreshAfterBaiduAjax = function () {
            document.getElementById('su').removeEventListener('click', refreshAfterBaiduAjax);
            this.init();
            this.show();
            this.hide();
        }
        console.log(this.engineName)
        // TODO 百度使用 ajax 更新搜索的时候会部分刷新
        // if (this.engineName === 'baidu') {
        //     let ob = new MutationObserver(function (mutations) {
        //         mutations.forEach(mutation => console.log(mutation))
        //     });
        //     ob.observe(document.querySelector('#wrapper_wrapper'), {
        //         attributes: true, childList: true, characterData: true
        //     })
        // }
    },

    getMatchSearchResult: function (blockList) {
        this.targetResult = [];
        let engineName = this.currentEnginesName()
        let hrefClassName = { google: '_Rm', baidu: 'c-showurl' ,bing:'b_attribution'}[engineName];  // 连接的类名
        let boxClassName = { google: 'g', baidu: 'result',bing:'b_algo' }[engineName];        // 结果容器的类名
        for (let ele of document.getElementsByClassName(hrefClassName)) {   // 遍历所有结果, 把域名匹配的 父级 box 节点 放在 targetResult 中
            if (blockList.some((site) => site.length && ele.innerHTML.indexOf(site) !== -1)) {
                let box = ele.parentElement.closest('.' + boxClassName);
                this.targetResult.push(box);
            };
        }
        return this.targetResult
    },

    /**
     * 判断当前页是不是处于启用状态的搜索引擎
     */
    isCurrentSearchEngineEnable: function (enabledSearchEngines) {
        if (this.currentEnginesName() === 'google' && window.location.pathname === '/search') {
            return enabledSearchEngines.google;
        } else if (this.currentEnginesName() === 'baidu' && window.location.pathname === '/s') {
            return enabledSearchEngines.baidu;
        } else if (this.currentEnginesName() === 'bing' && window.location.pathname === '/search') {
            return enabledSearchEngines.bing;
        }
    },

    /**
     * 获取当前可能的搜索引擎名称
     */
    currentEnginesName: function () {
        if (window.location.origin.indexOf('baidu') !== -1) return 'baidu';
        if (window.location.origin.indexOf('google') !== -1) return 'google';
        if (window.location.origin.indexOf('bing') !== -1) return 'bing';
        else return null;
    },

    /**
     * 隐藏
     */
    hide: function () {
        chrome.storage.sync.get({
            extensionEnabled: true,
            blockList: '',
            enabledSearchEngines: {
                google: true, baidu: true
            },
        }, function (param) {
            this.option = param;
            if (this.option.extensionEnabled && param.blockList !== '' && this.isCurrentSearchEngineEnable(param.enabledSearchEngines)) {
                this.getMatchSearchResult(param.blockList.split("\n"))
                for (let box of this.targetResult) {
                    box.style.display = 'none';
                }
                this.blockedInfoSpan.innerHTML = 'SRB Blocked ' + this.targetResult.length + ' items';
                this.status.enabled = true;
            }
            this.SearchResultBox.style.visibility = 'visible';
        }.bind(this))
    },

    /**
     * 恢复显示
     */
    show: function () {
        for (let box of this.targetResult) {
            box.style.display = 'block';
        }
        this.blockedInfoSpan.innerHTML = 'SRB Disabled'
        this.status.enabled = false;
    }
}

searchResultBlock.init();
searchResultBlock.hide();


