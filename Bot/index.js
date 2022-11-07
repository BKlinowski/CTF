import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"],
  });
  const [page] = await browser.pages();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("http://backend:80/login", { waitUntil: "networkidle0" });

  await page.type("#login__email", "thief@codeberry.pl");
  await page.type(
    "#login__password",
    "$GgK2MN##2zy^8mdKP$iPF$Y^CBm2!h#Yf*R*7fdSf@XqXt2UgW8P2XN!Wy4GCW#"
  );
  await Promise.all([
    page.click(".btn-login"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  setInterval(async () => {
    await page.goto("http://backend:80/services", {
      waitUntil: "networkidle0",
    });
  }, 1000);

  await browser.close();
})();
