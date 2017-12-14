# SRB - Search Result Block

## 功能 Feature

- Hide Some Page In Some Domain Which You Don't Like When You Are Searching The WebSite
-  当你使用搜索引擎时，隐藏来自你不喜欢的域名的页面。

## 配置 Config

在 `Block Site` 中添加网址即可, 每个一行, 目前使用简单字符串匹配

```
jianshu.com
jianshu.io
```

## 存在的问题 Issues

- 百度搜索引擎在第一次搜索之后 , 会使用 Ajax 刷新页面, 导致插件失效

## 下一版本 Next Version

- 支持正则表达式 . Supports Regular expression
- 优化 `popup` 状态显示. Impove state display in popup. 