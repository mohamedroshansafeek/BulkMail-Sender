const fileinput = document.getElementById("fileinput")

fileinput.addEventListener("change",function(event){
    const file = event.target.files[0]
   
    const reader = new FileReader()

    console.log("XLSX available?", typeof XLSX);


    reader.onload = function(event){
        const data = new Uint8Array(event.target.result) 
        //const data = event.target.result
        const workbook = XLSX.read(data, {type:'array'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName] 
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        console.log(emailList)
    }

    //reader.readAsBinaryString(file)
   reader.readAsArrayBuffer(file);
})


