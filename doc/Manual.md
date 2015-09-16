# 云商服WEB SDK使用手册

概述内容

## 使用说明

云商服WEB SDK提供两种方式给第三方产品嵌入在线客服功能

### 方式一： 

1. 获取SDK代码嵌入产品页面（代码获取方式待定）

    ```html
    <script src="//ysf.com/sdk/[APPKEY].js" charset="UTF-8"></script>
    ```
    
    其中[APPKEY]为企业从云商服申请到的应用标识，如044865c94981c048609d5c94c1ae9c6d，企业可以从这里获取(获取方式待定)自己的应用标识

2. 配置企业信息，如果不想配置企业信息可忽略此步骤

    企业可以通过请求脚本时增加[企业配置信息](#企业信息)，如以下方式

    ```html
    <script src="//ysf.com/sdk/[APPKEY].js?uid=xxxx&name=xxxx" charset="UTF-8"></script>
    ```
    
    也可以在载入SDK之后调用[ysf.config](#ysf.config)接口配置企业信息，如以下方式

    ```html
    <script src="//ysf.com/sdk/[APPKEY].js" charset="UTF-8"></script>
    <script>
        ysf.config({
            uid:'1442286211167',
            name:'test_user',
            email:'user@test.com'
        });
    </script>
    ```

3. 完整页面实例展示

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>在线客服</title>
            <meta charset="utf-8"/>
        </head>
        <body>
            <!-- YOUR CODE HERE -->
            
            <script src="//ysf.com/sdk/044865c94981c048609d5c94c1ae9c6d.js?uid=123&name=caijf&email=genify@163.com" charset="UTF-8"></script>
        </body>
    </html>
    ```

### 方式二： 

1. 执行方式一的第一步

2. 如果有需要可以执行方式一的第二步

3. 企业自己定义聊天按钮的效果，并在用户点击在线客服时调用[ysf.open](#ysf.open)打开聊天窗口

    ```html
    <a onclick="ysf.open();return false;" href="#">在线客服</a>
    ```

4. 完整页面实例展示

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>在线客服</title>
            <meta charset="utf-8"/>
        </head>
        <body>
            <!-- YOUR CODE HERE -->
            <a id="kefu" href="#">在线客服</a>

            <script src="//ysf.com/sdk/044865c94981c048609d5c94c1ae9c6d.js" charset="UTF-8"></script>
            <script>
                ysf.config({
                    uid:'1442286211167',
                    name:'test_user',
                    email:'user@test.com'
                });
                document.getElementById('kefu').onclick = function(event){
                    // prevent default event
                    ysf.open();
                }
            </script>
        </body>
    </html>
    ```

## 企业信息

使用SDK时可以配置一些企业产品相关的用户信息，以便在客服后台可以正确识别出对应的用户，云商服WEB SDK提供企业可以设置以下信息：

| 参数    | 类型   | 描述  |
| :----: | :----: | :---- |
| uid    | String | 可选，用户在企业产品中的标识，便于后续客服系统中查看该用户在产品中的相关信息，不传表示匿名用户 |
| name   | String | 可选，用户名称 |
| email  | String | 可选，邮箱地址 |

## 接口说明

### ysf.config

配置企业及用户信息，嵌入云商服SDK后可直接配置这些信息

使用范例

```javascript
ysf.config({
    uid:'1442286211167',
    name:'test_user',
    email:'user@test.com'
});
```

输入参数说明：

| 参数    | 类型   | 描述  |
| :----: | :----: | :---- |
| options   | Object  | 企业配置信息  |

### ysf.open

打开客服聊天窗口

如果已经使用[ysf.config](#ysf.config)接口做了企业和用户信息配置的话这里可以不传参数，使用范例如下：

```javascript
ysf.open();
```

如果没有使用[ysf.config](#ysf.config)接口配置过企业和用户信息，需要在open的时候输入配置信息，参数同[ysf.config](#ysf.config)接口，使用范例如下：

```javascript
ysf.open({
    uid:'1442286211167',
    name:'test_user',
    email:'user@test.com'
});
```

## 使用举例

TODO
