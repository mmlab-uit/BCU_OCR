var background_removal=1
var text_correction=1

document.querySelector('#background_removal').addEventListener('change',(event)=>{
    background_removal=background_removal^1
})
document.querySelector('#text_correction').addEventListener('change',(event)=>{
    text_correction=text_correction^1
})




// OCR API CALL //
document.querySelector('#submit_ocr').addEventListener('click',(event)=>{
    if(File_Content){
        console.log(File_Content)
        const formData = new FormData();
        formData.append('image', File_Content);
        formData.append('background_removal',background_removal)
        formData.append('text_correction',text_correction)
        OCR_API_Call(formData)
    }
    else alert('Please Upload Image First !')
})
async function OCR_API_Call(formData){    
    const response=await fetch('https://xoebif6n3f6cc5rsbcruhkgney0zfirk.lambda-url.ap-southeast-1.on.aws/',{
        method:'POST',
        body:formData
    })
    const jsonResponse = await response.json(); 
    const result=jsonResponse['result']
    localStorage.setItem('img_path',JSON.stringify(result['img_path']))
    localStorage.setItem('bbox',JSON.stringify(result['bounding_box']))
    localStorage.setItem('text',JSON.stringify(result['text']))

}





// QUESTION ANSWERING API CALL //
document.querySelector('#question_submit').addEventListener('click',(event)=>{
    var question=document.getElementById('insert_question').value
    if (question){
        var list_img_path=JSON.parse(localStorage.getItem('img_path'))
        var bbox=JSON.parse(localStorage.getItem('bbox'))
        var ocr_text=JSON.parse(localStorage.getItem('text'))
        if(list_img_path && bbox && ocr_text) APICall_Question(question,list_img_path,bbox,ocr_text)
        else alert("Error!")
    }
    else alert('Please specify your question!')
})

async function APICall_Question(question,img_path,bbox,text){
    var content={
        question:question,
        img_path:img_path,
        bbox:bbox,
        txt:text
    }
    const response=await fetch('https://jgdujy7vda5ezafdks76q5rbzu0sngqm.lambda-url.ap-southeast-1.on.aws/',{
            method:'POST',
            body:JSON.stringify(content)
    })
    const jsonResponse = await response.json(); 
    const result=jsonResponse['answer']
}