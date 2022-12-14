//로그인 토큰 확인
function auction_create_service(){
    const storge = localStorage.getItem("payload");
    if (storge){
    }else {
        alert("로그인이 필요합니다.")
        location.replace(history.back())
    }}
auction_create_service()


let getLink = window.location.search;
let getLink_Name = getLink.split('=');
let id = getLink_Name[1]


window.onload = async function paintingLoad(){

    const response = await fetch(`${backendBaseUrl}/paintings/${id}/`,{
        method: 'GET',
        headers:{
            "Accept": "application/json",
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("access")
            }   
        }
    )
    response_json = await response.json()

    const image_after = document.getElementById("image_after")
    const image_painting = response_json.after_image
    image_after.setAttribute("src",`${backendBaseUrl}${image_painting}`)

    const painting_title = document.getElementById("painting_title")
    painting_title.innerText = response_json.title
}



async function AuctionCreate(){

    const start_bid = document.getElementById("start-price").value
    const now_bid = document.getElementById("start-price").value
    const end_date = document.getElementById("Date").value

    const response = await fetch(`${backendBaseUrl}/auctions/${id}/`,{
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify({"start_bid": start_bid, "now_bid":now_bid, "end_date":end_date})
        
    })

    const response_json = await response.json()

    if (response.status === 200) {
        alert('등록완료!')
        location.replace('profile.html')
    }else if (response.status === 400 && response_json["end_date"])  {  
        alert(response_json["end_date"])
    }
    else if (response.status === 400 && response_json["start_bid"])  {  
        alert(response_json["start_bid"])
    }
    else if (response.status === 400 && response_json["message"])  {  
        alert(response_json["message"])
    }
}

const page_cancel=() => {
    location.replace('profile.html')
}



    