# tutore.me

## Feladat leírása
### Webes korrepetálás hirdető oldal
A feladat egy webes korrepetálás hirdető oldal fejlesztése, melyen lehet korrepetálást kínálni illetve keresni, különböző szűrőfeltételeket megadni (ár, hely, kurzus, szint), legyen egy admin felület, ahol lehet az eddigi hirdetéseket kezelni. Lehessen a korrepetítorokat értékelni. A hirdetéseket regisztráció nélkül is lehet látni.

## Rendszer funkciók

### Főoldal / hirdetések listája
A honlapon a főoldalon látható az összes hirdetés, amikre lehet jelentkezni, illetve lehet szűrni különböző feltételek alapján
  * Keres / kínál
  * Tárgy
  * Hely
  * Szint

### Bejelentkezés / regisztráció
Hogy a felhasználók tudjanak hirdetéseket feladni, illetve hogy tudjanak kapcsolatba lépni egy hirdetővel, be kell regisztrálniuk.

### Profil
A felhasználóknak van egy saját profil oldaluk, ahol láthatják és módosíthatják a saját személyes adataikat, illetve láthatják a hirdetéseiket, és a mások által adott értékeléseket. Van lehetőség a hirdetések utólagos szerkesztésére, vagy lehet őket törölni is.

### Üzenetek
A felhasználóknak lehetősége van megnézni a bejövő üzeneteket, és ezekre válaszolni is. Erre azért van szükség, hogy ne legyenek nyilvánosak a személyes adatok, pl email cím.

### Hirdetések feladása
A felhasználók bejelentkezés után tudnak feladni hirdetéseket. Az oldalon meg kell adni kötelező adatokat, pl cím, keres/kínál, tárgy, és utána a főoldalon megjelenik a hirdetése. A hirdetés csak egy bizonyos ideig látható (1 hónap) melyet meg lehet újítani, de ha nem újítják meg, akkor automatikusan törlődik.

### Admin felület
A hirdetések kezelésére van egy admin felület, ahol lehetőség van egy kitüntetett szerepű embernek törölni, módosítani hirdetéseket és értékeléseket, illetve kitiltani felhasználókat. Az admin felületen látható az össze hirdetés illetve felhasználó, és lehet szűrni a reportolt hirdetésekre, értékelésekre illetve felhasználókra

### Reportolás
Hogy a tartalmak megfelőek legyenek van lehetőség reportolásra, amivel lehet kifogásolni a nem megfelelő tartalmakat. Ezeket egy rövid indoklással megjelennek az adminnak, aki felülbírálhatja, és a megfelelő dolgot teheti.

## Mockupok
### Főoldal
![Main page](https://github.com/fehergeri13/tutore.me/raw/master/docs/Main%20page.png)

### Bejelentkezés / regisztráció
![Login Register page](https://github.com/fehergeri13/tutore.me/raw/master/docs/Login_Registration.png)

### Saját profil
![Profile page](https://github.com/fehergeri13/tutore.me/raw/master/docs/My%20profile%20page.png)

### Más profilja
![Profile page](https://github.com/fehergeri13/tutore.me/raw/master/docs/Other's%20profile%20page.png)

### Üzenetek
![Messages page](https://github.com/fehergeri13/tutore.me/raw/master/docs/Messages.png)

### Hirdetések feladása
![Login Register page](https://github.com/fehergeri13/tutore.me/raw/master/docs/New%20ad.png)

### Admin felület
![Admin page](https://github.com/fehergeri13/tutore.me/raw/master/docs/Admin_%20user%20search.png)

## Minőségi jellemzők

### Biztonság (security)
Fontos a biztonság, erre az alábbi módon szeretnénk figyelni:
 - A jelszavakat az adatbázisban csak titkosított formában tároljuk, nem tárolunk plaintext jelszót
 - A személyes adatokat nem adjuk ki, azt csak a felhasználó tudja elküldeni üzenetben, amennyiben szeretné. Harmadik felek csak a felhasználó nevet láthatják.
 
### Biztonság (safety)
A felhasználók biztonsága is fontos, ebben főleg a visszaélések megakadályozása az elsődleges. Emiatt a rendszer támogat egy reportolási lehetőséget, ami jelzi az admin felé, hogy az adott dolog kifogásolható, ezután az admin felülvizsgálja, és a szükséges lépéseket megteszi.

### Design
Fontosnak tartjuk, hogy a rendszer kinézete és használata ergonómikus legyen, és modern legyen, illetve támogassa mind az asztali számítógépeket, mind a mobil készülékeket. A weboldal akadálymentesített legyen vakok és gyengénlátók szempontjából.

## Platform megjelölése
A rendszert a klasszikus három rétegű architektúrában szeretnénk megvalósítani, frontend, backend, database rétegezéssel.

A frontendet React Javascript framework segítségével szeretnénk elkészíteni.
A backendet Nodejs alapon készítenénk el.
Az adatbázis MongoDB lenne.

A frontend és a backend RestAPI segítségével fog tudni kommunikálni egymással.
