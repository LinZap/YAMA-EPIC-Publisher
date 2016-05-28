# YAMA EPIC Publisher

粉絲專頁 [YAMA EPIC Song](https://www.facebook.com/ClanYAMA/) 自動發文機器人

## Usage



## Video title Segmentation
針對影片標題斷詞，是假定 Title 中含有「部分」 *歌名* + *演場者* 的前提下進行自動解析的策略。

### Delimiter Token Filter
這裡以歌名並不會只由 delimiter 組成的前提進行過濾，將使用以下幾個 regular expression 進行處理。

* `0-9A-Za-z`：取出英數
* `\u4e00-\u9fa5`：取出中文 (含簡繁)
* `\x3130-\x318F`：取出韓文
* `\xAC00-\xD7A3`：取出韓文 (棄用)
* `\u0800-\u4e00`：取出日文 (棄用)

> 傳統的 `\u0800-\u4e00` 方式取出日文，會包含全形 delimiter，在這裡針對日文進行特別處理。

* `\u3041-\u309F`：取出平假名
* `\u30A1-\u30FF`：取出片假名
* `\u31F0-\u31FF`：取出擴展片假名

> 根據 unicode 官方文件中的說明，我們針對日文五十音的平假名與片假名進行擷取。
  * [平假名 Unicode 定義](http://www.unicode.org/charts/PDF/U3040.pdf) 
  * [片假名 Unicode 定義](http://unicode.org/charts/PDF/U30A0.pdf)
  * [擴展片假名 Unicode 定義](http://www.unicode.org/charts/PDF/U31F0.pdf)

在日語系國家中，也會常見全形英文或數字，也需要另外取出

* `\uFF10-\uFF19`：取出全形數字
* `\uFF21-\uFF3A`：取出全形英文大寫
* `\uFF41-\uFF5A`：取出全形英文小寫



## 
