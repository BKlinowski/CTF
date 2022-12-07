export const postCareer = async (req, res) => {
    console.log(req.files.myFile.mimetype);
    if (!req.files) {
      res.render('careerResponse.ejs', {response: "Nie dodano pliku!"});
    }
    else if (req.files.myFile.mimetype == "application/pdf"){

        const file = req.files.myFile;
        const magicBytes = file.data.slice(0, 5);
        const expectedMagicBytes = Buffer.from('255044462D', 'hex');
        if  (magicBytes == expectedMagicBytes.toString()){
            res.render('careerResponse.ejs', {response: "Dziekujemy za zgloszenie!"});
        }
        else{
            res.render('careerResponse.ejs', {response: "CTF{Nic3_try_m4gic_byt3s}"});
        }
    }
    else{
        res.render('careerResponse.ejs', {response: "Niepoprawny format pliku!"});
    }
    }
    