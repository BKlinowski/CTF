const contactUs = async (event) => {
    event.preventDefault()
    let firstName = document.querySelector("#contact__inputFirstname").value
    let surname = document.querySelector("#contact__inputSurname").value
    let email = document.querySelector("#contact__inputEmail").value
    let tel = document.querySelector("#contact__inputTelephone").value
    let additionalInfo = document.querySelector("#contact__textareaAdditionalInfo").value
    const data = JSON.stringify({ firstName, surname, email, tel, additionalInfo })
    console.log(data)
    try {
        const res = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
        return res
    } catch (err) {
        console.error(err)
    }
    /* DEBUG ONLY 
    Application shouldn't accept request in XML format. 
    Remove it on production.
    */
}