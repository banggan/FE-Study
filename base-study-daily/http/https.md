- HTTP通信存在什么问题 ？
- HTTPS如何改进HTTP存在那些问题 ？
- HTTPS工作原理是什么 ？
 
 ####  什么是HTTPS ？

 HTTPS是在HTTP上建立SSL加密层，并对传输数据进行加密，是HTTP协议的安全版。现在它被广泛用于万维网上安全敏感的通讯，例如交易支付方面。

HTTPS主要作用是：

（1）对数据进行加密，并建立一个信息安全通道，来保证传输过程中的数据安全;

（2）对网站服务器进行真实身份认证。
#### 为什么需要HTTPS?

- HTTP协议存在的哪些问题：
  1.通信使用明文（不加密）；
  2.内容可能被窃听、无法证明报文的完整性，所以可能遭篡改；
  3.不验证通信方的身份，因此有可能遭遇伪装)
- HTTPS的优势： 
  1.数据隐私性：内容经过对称加密，每个连接生成一个唯一的加密密钥
  2.数据完整性：内容传输经过完整性校验
  3.身份认证：第三方无法伪造服务端（客户端）身份
#### HTTPS如何解决HTTP上述问题?
HTTPS并非是应用层的一种新协议。只是HTTP通信接口部分用SSL和TLS协议代替而已。

HTTPS 协议的主要功能基本都依赖于 TLS/SSL 协议，TLS/SSL 的功能实现主要依赖于三类基本算法：散列函数 、对称加密和非对称加密，其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。

- 1.解决内容可能被窃听的问题——加密（对称加密、非对称加密、对称+非对称）

使用对称密钥的好处是解密的效率比较快，使用非对称密钥的好处是可以使得传输的内容不能被破解；在交换密钥环节使用非对称加密方式，之后的建立通信交换报文阶段则使用对称加密方式。

具体做法是：发送密文的一方使用对方的公钥进行加密处理“对称的密钥”，然后对方用自己的私钥解密拿到“对称的密钥”，这样可以确保交换的密钥是安全的前提下，使用对称加密方式进行通信。所以，HTTPS采用对称加密和非对称加密两者并用的混合加密机制。
- 2.解决报文可能遭篡改问题——数字签名

数字签名有两种功效：
能确定消息确实是由发送方签名并发出来的，因为别人假冒不了发送方的签名。
数字签名能确定消息的完整性,证明数据是否未被篡改过。
- 3.解决通信方身份可能被伪装的问题——数字证书

数字证书认证机构处于客户端与服务器双方都可信赖的第三方机构的立场上。

#### HTTPS工作流程
1.Client发起一个HTTPS（比如 https://juejin.im/user）的请求，根据RFC2818的规定，Client知道需要连接Server的443（默认）端口。

2.Server把事先配置好的公钥证书（public key certificate）返回给客户端。

3.Client验证公钥证书：比如是否在有效期内，证书的用途是不是匹配Client请求的站点，是不是在CRL吊销列表里面，它的上一级证书是否有效，这是一个递归的过程，直到验证到根证书（操作系统内置的Root证书或者Client内置的Root证书）。如果验证通过则继续，不通过则显示警告信息。

4.Client使用伪随机数生成器生成加密所使用的对称密钥，然后用证书的公钥加密这个对称密钥，发给Server。

5.Server使用自己的私钥（private key）解密这个消息，得到对称密钥。至此，Client和Server双方都持有了相同的对称密钥。

6.Server使用对称密钥加密“明文内容A”，发送给Client。

7.Client使用对称密钥解密响应的密文，得到“明文内容A”。

8.Client再次发起HTTPS的请求，使用对称密钥加密请求的“明文内容B”，然后Server使用对称密钥解密密文，得到“明文内容B”。
#### HTTP 与 HTTPS 的区别
- HTTP 是明文传输协议，HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 协议安全。
- HTTPS比HTTP更加安全，对搜索引擎更友好，利于SEO,谷歌、百度优先索引HTTPS网页;
- HTTPS需要用到SSL证书，而HTTP不用;
- HTTPS标准端口443，HTTP标准端口80;
- HTTPS基于传输层，HTTP基于应用层;
- HTTPS在浏览器显示绿色安全锁，HTTP没有显示;