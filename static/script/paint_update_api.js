//로그인 토큰 확인
function painting_update_service(){
    const storge = localStorage.getItem("payload");
    if (storge){
    }else {
        alert("로그인이 필요합니다.")
        location.replace(history.back())
    }}
    painting_update_service()

let getPaint = window.location.search;
let getPaint_Name = getPaint.split('=');
let id_Paint = getPaint_Name[1]



window.onload = async function paintingLoad(){

    const response = await fetch(`${backendBaseUrl}/paintings/${id_Paint}/`,{
        method: 'GET',
        headers:{
            "Accept": "application/json",
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("access")
            }   
        }
    )
    response_json = await response.json()
    if (response.status === 200) {
    const image_after = document.getElementById("image_after")
    const image_painting = response_json.after_image
    image_after.setAttribute("src",`${backendBaseUrl}${image_painting}`)

    const painting_title_update = document.getElementById("painting_title")
    const painting_content_update = document.getElementById("painting_content")

    painting_title_update.value  = response_json.title
    painting_content_update.value  = response_json.content


    } else if (response.status === 403 ) {
        alert("접근 권한이 없습니다.")
        history.back();
    }


}




async function painting_Update(){

    const painting_title_update = document.getElementById("painting_title").value;
    const painting_content_update = document.getElementById("painting_content").value;

    const response = await fetch(`${backendBaseUrl}/paintings/${id_Paint}/`,{
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type":"application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify({"title": painting_title_update, "content":painting_content_update})
    })


    response_json = await response.json()
    if (response.status === 200) {
        alert('수정되었습니다!')
    } else if (response.status === 400 ) {
        alert("접근 권한이 없습니다.")
        history.back();
    }
    move_profile_page()

}



function move_profile_page(){
    window.location.href = `/profile.html`
}