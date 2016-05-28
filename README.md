# YAMA EPIC Publisher

**YAMA EPIC Publisher** 是一個專門的 [YouTube](https://www.youtube.com) 影片自動分享機器人，它能自動偵測您 [Channels](https://www.youtube.com/channels) 的所有**播放清單**，只要您將想分享的音樂加入，經過一段時間後，它會自動分析影片關鍵字、找出相關連結並將結果蒐集整理成一篇文章，分享到您的粉絲專頁。  

目前它運行於粉絲專頁 [YAMA EPIC Song](https://www.facebook.com/ClanYAMA/)。

## Introduction

系統由純 [Node.js](https://nodejs.org/en/) 建立。為了自動分析影片文字內容，進而蒐集更多資料將發表的文章豐富化，而非單純只有 URL，因此系統設計了數個模組進行解決。

### Mojim Crawler
系統以 [魔鏡歌詞網](mojim.com) 上收錄的演唱者與音樂名稱輔助影片標題解析，目的是從標題中抽取正確的資訊進行文章內容的補充。


### Google Crawler
為了補充發表文章的內容，從標題中解析出正確資訊後，透過 Google Crawler 搭配關鍵字，補充文章更多資料。以目前的系統為例，給予正確的演唱者資訊，Google 能夠精準地找到官方網站或 Twitter。

### YouTube detector
為了讓自動發文更加方便，系統能夠偵測一個您所屬的 YouTube Channel，您可以在上面建立數個不等的播放清單作為音樂分類，當您瀏覽到想分享的影片時，只需要將影片加入播放清單，透過 YouTube detector 就能自動發現新增的影片，並使用上述 Mojim Crawler 與 Google Crawler 的幫助下，自動發表一篇擁有豐富內容的文章。



## Build
您也可以建立屬於您自己的自動發文機器人，但需要先準備以下項目，以及建立系統需要的環境：

* 自己的粉絲專頁
* 自己的 YouTube Channel

### Mojim Database
從 [魔鏡歌詞網](mojim.com) 抓取的資料必須存放在資料庫，系統使用 [PostgreSQL](https://www.postgresql.org/) 儲存，版本必須大於等於 `9.4`，就緒後就可以建立分析用資料庫。

**設定連線參數**  
`_mojim-crawler/const.json`
```json
{
    ...
	"db":{
		"user": "",
		"password": "",
		"database": "mojim",
		"host": "",
		"port": 
	}
}

```

**重新建立子系統資料庫**
```
cd _mojim-crawler/
npm install

node build/build.js
```
**初始化爬蟲**
```
node bin/init.js
```
**執行爬蟲**
```
node bin/crawler.js
```
**執行更新爬蟲**
```
node bin/updater.js
```
> 這裡請注意，更新爬蟲 `bin/updater.js` 執行的最佳策略是設定排程，以天為單位進行更新，而非手動執行。  
> 資料庫名稱為 `mojim`，請勿修改。您可以在您的 PostgreSQL 中找到它。


### Google Crawler
使用普通的 [Request](https://github.com/request/request) 無法正常的抓取 Google Search 的結果，因為 Google 針對機器人爬蟲有做一系列的防護措施。因此系統使用 [PhantomJS](http://phantomjs.org/) 進行 Human like 的 Google Search 擷取。

**下載 [PhantomJS](http://phantomjs.org/download.html) **  
您需要下載 [PhantomJS](http://phantomjs.org/) 的主程式，放置於 `_google-crawler`。以 `windows` 系統為例，需要將 `phantomjs.exe` 放在 `_google-crawler/` 目錄下即可。

**設定爬蟲參數**  
`_google-crawler/const.json`
```json
{
	"phantom" : "phantomjs.exe",
	"crawler" : "crawler.js",
	"debug": false
}
```

> 若您的 PhantomJS 主程式名稱不同，請在上述設定檔中修改。

**測試爬蟲**  
由於 PhantomJS 是一個沒有視窗的瀏覽器，您可以將 `_google-crawler/const.json` 中的 `debug` 參數設為 `true`，如此一來每次進行爬蟲時，都會將網頁拍照存放在當前目錄下，作為 debug 使用。
```
cd _google-crawler/

node test/google.js [查詢字串]
```
  
  
### YouTube Database
由於我們需要紀錄發表過的影片，因此系統使用 [lowdb](https://github.com/typicode/lowdb) 作為 YouTube 資料儲存的容器，lowdb 是一個 json-based 的檔案資料庫，由於使用 JSON 格式存放，它的概念與 NOSQL 相似，我們使用它來進行高效的資料存取。

**安裝主系統必要套件**
```
cd yama-epic-publisher/
npm install
```
**設定 Google API Key 與 YouTube Channel ID**  
`yama-epic-publisher/const.json`
```json
...
  "youtube":{
      "key": "",
      "channelId": ""
  },
...
```

> 若您找不到自己的 Channel ID，請先前往 YouTube 並將切換成頻道帳號，然後點選這個連結進入([進階帳戶設定](https://www.youtube.com/account_advanced))。您可以在下方找到 `YouTube 頻道 ID：UCwA1gUVVzC....` 就是 Channel ID。

<br>
**執行 YouTube detector**  
執行後，您 Channel 上的**播放清單**與**影片**將被存放在本地的 `lowdb` 中，您可以在 `yama-epic-publisher/db_youtube.json` 中找到儲存的資料。

系統會自動將「播放清單」
```
node bin/youtube-detetctor.js
```

> 由於您會不斷在 YouTube 上添加影片到播放清單，因此最佳方案是設定排程執行 `bin/youtube-detetctor.js`，您可以設定每 6 個小時更新一次播放清單。 

> 系統會自動將「播放清單」的名稱作為 [Facebook HashTag](https://www.facebook.com/help/587836257914341) 標註在文章內容中 ！也就是說，您可以將影片加入你想標註的 HashTag 同名的播放清單中，系統就會同時標註多個 HashTag。
<br>

### Publish to Facebook
能夠更新播放清單中的影片之後，系統最後要將影片發佈到 Facebook 的粉絲專頁上。  
首先您必須要擁有一個管理粉絲專頁的開發者 App (若沒有請申請一個)。前往 [Graph API Explorer](https://developers.facebook.com/tools/explorer/) 中，選擇欲管理粉絲專頁的 App，取得「粉絲專頁存取權杖 Page AccessToken」(請注意要選到正確的粉絲專頁)。然後將 AccessToken 複製下來，準備後續使用。

<br>
**Logn Time AccessToken**  
從 Graph API Explorer 上複製的 AccessToken 只能存活一小段時間，便會過期。若您希望自動發文機器人能正常運作，需要長效的 AccessToken。

關於如何換取長效 AccessToken 的方式，官方有進行 [完整說明](https://developers.facebook.com/docs/facebook-login/access-tokens)，系統將以上繁複過程簡化成一個指令，方便您換取長效 AccessToken。

```
node bin/change-accesstoken.js [App ID] [App Secret] [AccessToken]
```

透過以上指令，便可以得到一組長效的 AccessToken


**設定 AccessToken 與 存取資料庫參數**

`yama-epic-publisher/const.json`
```json
  "db":{
      "user": "",
      "password": "",
      "database": "mojim",
      "host": "",
      "port": 
  },
...

  "graph":{
      ...
      "AccessToken": "..."
  },
```

**現在，一切就緒，自動 Publish**

經過上述的系統建置，應該已經頭昏眼花了。現在終於可以進行自動發文。  
假設您的 Channel 已經有數個播放清單，且其種含有數個影片。在執行 `YouTube detector` 後，會將尚未發布的影片紀錄在 `lowdb' '(yama-epic-publisher/db_youtube.json)` 中，這時候就可以執行自動 Publish。

```
node bin/yama-epic-publisher.js
```
執行後，會將發布文章的 URL 顯示在 CLI 上，或者直接前往粉絲專頁觀察。  
<br>
**觀察模式**  
若您想先預覽發表後的文章樣子，可以帶 `-v` 參數，系統不會發布文章，而只是將愈發表的內容顯示在 CLI 上供您檢視。

```
node bin/yama-epic-publisher.js -v
```
<br>

##進階調教
系統能夠人工介入調整參數、關鍵字等，使自動撰寫的文章更加豐富、準確。
待續...

<br>
## MPL LICENSE
```
The contents of this file are subject to the Mozilla Public License  
Version 1.1 (the "License"); you may not use this file except in  
compliance with the License. You may obtain a copy of the License at  
https://www.mozilla.org/MPL/  
...
```

