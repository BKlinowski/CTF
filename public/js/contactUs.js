const contactUs = async (event) => {
  event.preventDefault();
  let firstName = document.querySelector("#contact__inputFirstname").value;
  let surname = document.querySelector("#contact__inputSurname").value;
  let email = document.querySelector("#contact__inputEmail").value;
  let tel = document.querySelector("#contact__inputTelephone").value;
  let additionalInfo = document.querySelector(
    "#contact__textareaAdditionalInfo"
  ).value;
  const data = JSON.stringify({
    firstName,
    surname,
    email,
    tel,
    additionalInfo,
  });
  console.log(data);
  try {
    let res = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    res = await res.text();
    console.log(res);
    document.body.innerHTML = res;
  } catch (err) {
    console.error(err);
  }
  /* DEBUG ONLY 
    Application shouldn't accept request in XML format. 
    Remove it on production.

    Log file is stored inside /var/ultra_secure_folder/logs
*/
};

const postLogin = async (event) => {
  event.preventDefault();
  let email = document.querySelector("#login__email").value;
  let password = document.querySelector("#login__password").value;
  const data = JSON.stringify({ email, password });
  console.log(data);
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const { token } = await response.json();
    if (token) {
      localStorage.setItem("token", token);
    }
  } catch (err) {
    console.error(err);
  }
};
