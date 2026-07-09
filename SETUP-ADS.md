# Siteye Monetag Reklamı Ekleme — Adım Adım

Oyun (Telegram Mini App) zaten Monetag reklamı gösteriyor. Bu rehber **web sitesi**
(sanslicekilis.com) için ayrı bir Monetag reklamını açar. Kod hazır — sadece Monetag'den
2 değer alıp Vercel'e girmen gerekiyor. Değerler girilene kadar site normal çalışır,
hiçbir şey bozulmaz (reklam kodu sadece ayar varsa yüklenir).

> Neden ayrı zone? Monetag'de "Telegram Mini App" zone'u ile "Website" zone'u farklıdır.
> Oyundaki zone (10975774) sitede çalışmaz; site için yeni bir zone açman lazım.

## 1) Monetag'de siteyi ekle
1. https://monetag.com → giriş yap.
2. Sol menü **Sites / Websites** → **Add new site**.
3. Site adresi: `sanslicekilis.com` → ekle.
4. Monetag küçük bir doğrulama isteyebilir (bir meta etiketi veya ads.txt). İsterse
   bana söyle, o doğrulama satırını da siteye ekleyeyim.

## 2) Zone (reklam birimi) oluştur
1. Site onaylanınca **Create ad zone** / **Multitag** seç. (Multitag önerilir: tek kodla
   Monetag en iyi formatı kendi seçer — açılır reklam, in-page push, vignette vb.)
2. Oluşunca sana bir **kod parçası (snippet)** verir. Şuna benzer:

   ```html
   <script src="//fpyf8.com/tag.min.js" data-zone="1234567" data-cfasync="false" async></script>
   ```

   Bu satırdan iki şey lazım:
   - **Zone ID** → `data-zone="..."` içindeki numara (örnekte `1234567`)
   - **Src** → `src="//..."` içindeki adres (örnekte `//fpyf8.com/tag.min.js`)

## 3) Vercel'e gir (siteyi canlıya bağlayan yer)
1. https://vercel.com → **sans-token** projesi → **Settings** → **Environment Variables**.
2. İki değişken ekle (Production + Preview + Development hepsini işaretle):

   | Name | Value (örnek) |
   |------|----------------|
   | `NEXT_PUBLIC_MONETAG_SITE_ZONE` | `1234567` |
   | `NEXT_PUBLIC_MONETAG_SITE_SRC`  | `//fpyf8.com/tag.min.js` |

   (Kendi zone'unun gerçek numarasını ve adresini yaz.)
3. **Save** → **Deployments** → en üstteki dağıtımda **⋯ → Redeploy**.

Bitti. Redeploy sonrası site reklam göstermeye başlar. Format çok agresifse (örn. çok
açılır reklam), Monetag panelinden zone ayarlarından yumuşatabilirsin.

## Yerelde denemek (opsiyonel)
`sans-token` klasöründe `.env.local` dosyası oluştur:

```
NEXT_PUBLIC_MONETAG_SITE_ZONE=1234567
NEXT_PUBLIC_MONETAG_SITE_SRC=//fpyf8.com/tag.min.js
```

Sonra `npm run dev` → reklam tag'i yüklenir.

## Nasıl çalışıyor (teknik)
- `components/MonetagAds.tsx` — zone + src ayarlıysa Monetag tag'ini yükler, değilse
  hiçbir şey yapmaz (site bozulmaz).
- `app/layout.tsx` — bu bileşen her sayfada `<MonetagAds />` ile yüklenir.
