const auction_id = location.href.split('=')[1].split('/')[0]

$(document).ready(function(){
    loadAuction();
    loadComment();
    Auction_History_View();
    Nav_Profile();
});

//시간 포맷팅
function time2str(date) {
    let today = new Date()
    let before = new Date(date)
    let time = (today - before) / 1000 / 60  // 분
    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
};


//경매 상세페이지
async function loadAuction() {
    const response = await fetch(`${backendBaseUrl}/auctions/detail/${auction_id}/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        }})


    response_json = await response.json()

    const auction_title = document.getElementById("auction_title")
    const auction_owner = document.getElementById("auction_owner")
    const auction_author = document.getElementById("auction_author")
    const auction_content = document.getElementById("auction_content")
    const auction_like_count = document.getElementById("auction_like_count")
    const auction_now_bid = document.getElementById("auction_now_bid")


    const user_id = JSON.parse(localStorage.getItem(["payload"])).user_id
    console.log(response_json.auction_like.indexOf(user_id))

    if (response_json.auction_like.indexOf(user_id) == -1){
        const heart_confirm = document.getElementById("heart_confirm")
        heart_confirm.innerHTML =`<i class="ri-heart-line"></i><span>${response_json.auction_like_count}</span>`
    } 

    if (user_id === response_json.seller) {
        const auction_delete__view = document.getElementById("auction_delete__view")
        auction_delete__view.setAttribute("style", "display:block;")
    }




    const now_bid = response_json.now_bid.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    auction_title.innerText = response_json.painting.title   
    auction_owner.innerText = response_json.painting.owner
    auction_author.innerText = response_json.painting.author
    auction_content.innerText = response_json.painting.content
    auction_like_count.innerText = response_json.auction_like_count
    auction_now_bid.innerText = `${now_bid} Point`
    document.getElementById("auction_owner_profile_image").src = `${backendBaseUrl}${response_json.painting.owner_profile_image}`
    document.getElementById("auction_author_profile_image").src = `${backendBaseUrl}${response_json.painting.author_profile_image}`


    
    // 상세페이지 이미지
    const painting_image = document.getElementById("painting_image")
    let image_url = response_json.painting.after_image
    painting_image.setAttribute("src", `${backendBaseUrl}${image_url}`)

    // 시간 formating
    const remaining_time = response_json.end_date

    // 경매 마감 남은 시간
    const remainTime = document.querySelector("#remain-time");
    
    function diffDay() {
        const masTime = new Date(remaining_time);
        const todayTime = new Date();
        
        const diff = masTime - todayTime;
        
        const diffDay = Math.floor(diff / (1000*60*60*24));
        const diffHour = Math.floor((diff / (1000*60*60)) % 24);
        const diffMin = Math.floor((diff / (1000*60)) % 60);
        const diffSec = Math.floor(diff / 1000 % 60);
        
        remainTime.innerText = `${diffDay}일 ${diffHour}시간 ${diffMin}분 ${diffSec}초`;
    }

    diffDay();
    setInterval(diffDay, 1000);
    }


// 낙찰가 Update
async function BidUpdate(){

    const bidData = {
        "now_bid": document.getElementById("now_bid").value,
    }   

    const response = await fetch(`${backendBaseUrl}/auctions/detail/${auction_id}/`, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            },
        body: JSON.stringify(bidData)
    }
    )

    const response_json = await response.json()

    if (response.status === 200) {
        alert("입찰이 완료되었습니다.")
        window.location.reload()
    }else if (response.status === 400 && response_json["error"])  {
        alert(response_json["error"])
        
    }else if(response.status === 400){
        alert("입찰가를 입력해주세요")
    }
}

// 경매 거래내역 불러오기
async function Auction_History_View(){

    const response = await fetch(`${backendBaseUrl}/auctions/${auction_id}/history/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            }
    }
    )
    response_json = await response.json()
        response_json.forEach(item => {
            const now_bid = item['now_bid'].toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            let time_before = time2str((item['created_at']))
            
            $('#auction_history_view').append(
                `
                <div class="single-item-history d-flex-center">
                    <div class="avatar">
                        <img src="${backendBaseUrl}${item['bidder_profile_image']}" alt="history">
                    <i class="ri-check-line"></i>
                    </div>
                    <!-- end avatar -->
                    <div class="content">
                    <p>Bid accepted <span class="color-primary fw-500">${now_bid}
                    Point</span> by <h5 style="font-size:16px;"class="text-white" >${item['bidder']}</h5></p>
                    <span class="date">${time_before}</span>
                    </div>
                </div>
                `
            )
        })
}
// 경매 삭제
async function AuctionDetailDelete() {
    var delConfirm = confirm("경매 취소하시겠습니까?")
    if (delConfirm) {
        const response = await fetch(`${backendBaseUrl}/auctions/detail/${auction_id}/`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
        )
        response_json = await response.json
        if (response.status === 200) {
            alert("경매가 취소되었습니다")
            location.replace('index.html')
        } else {
            alert(response_json["error"])

        }
    }
}
//좋아요 POST
async function AuctionLike() {
    const response = await fetch(`${backendBaseUrl}/auctions/${auction_id}/likes/`, {

        method: 'POST',
        headers: {
            Accept:"application/json",
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
    }
    )

    response_json = await response.json
    window.location.reload()
    

}



function doDisplay(id){ 	
    var con = document.getElementById("comment_content_2"+id); 	
    var con2 = document.getElementById("comment_content"+id);
    if(con.style.display=='none'){ 		
        con.style.display = 'block'; 
        con2.style.display = 'none';	
    }else{ 		
        con.style.display = 'none'; 	
        con2.style.display = 'block';
    } 
}


// 댓글 불러오기
async function loadComment() {
    const response2 = await fetch(`${backendBaseUrl}/auctions/${auction_id}/comments/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })
    response_json2 = await response2.json()
    var counts = Object.keys(response_json2).length
    count_comments.innerText = counts

    // user nickname 가져오기
    payload_data = localStorage.getItem("payload")
    payload_data = JSON.parse(payload_data)
    user = payload_data.nickname

    
    
    $('#comment_box').empty()
    response_json2.forEach(item => {

        
        
        
        let time_before = time2str((item['updated_at']))
        if (user == item['user']) {
            $('#comment_box').append(

                `<ul class="comment-box-inner" style="height:100px;">
                    <li class="single-comment-box d-flex-between ">
                        <div class="inner d-flex-start" style="position:relative;">
                                <img class="avatar" src="${backendBaseUrl}${item['profile_image']}" alt="author">
                            <!-- End .avatar -->
                            <div class="content">
                                <h5 class="title">${item['user']}<span class="date-post"> ${time_before} &nbsp&nbsp</span> 
                                <div class="more-dropdown details-dropdown"><i class="ri-more-fill" data-bs-toggle="dropdown"></i>
                                    <ul class="dropdown-menu dropdown-menu-dark">
                                    <div id="container">

                                        <button class="dropdown-item");" id="btn-modal${item['id']}" onclick=doDisplay(${item['id']})>Edit</button>
                                        <p></p>
                                        <a class="dropdown-item" onclick="deleteComment(${item['id']})">Delete</a>
                                        </div>

                                    </ul>
                                </div>
                                </h5>
                                <p id="comment_content${item['id']}">${item['content']}</p>
                                <div id="comment_content_2${item['id']}"class="content" style="display:none;width:1000px;">
                                    <textarea name="message" cols="20" rows="1" id="auction_comment_content_update${item['id']}"style="width:50%;display:inline-block;">${item['content']}</textarea>
                                    <div style="display:inline-block;vertical-align:middle;margin-bottom:50px;margin-left:50px;"><a class="btn btn-gradient btn btn-medium" onclick="updatecomment(${item['id']})"><span>수정</span></a></div>
                                </div>
                            </div>
                        </div>
                    </li>
                <!-- End .single-comment-box -->
                </ul></div>
                <hr>

                `
            )} else{
                $('#comment_box').append(

                    `<ul class="comment-box-inner" style="height:100px;">

                        <li class="single-comment-box d-flex-between ">
                            <div class="inner d-flex-start">
                                    <img class="avatar" src="${backendBaseUrl}${item['profile_image']}" alt="author">
                                <!-- End .avatar -->
                                <div class="content">
                                    <h5 class="title">${item['user']}<span class="date-post">${time_before}&nbsp&nbsp</span> 
                                    </h5>
                                    <p id="comment_content">${item['content']}</p>
                                </div>
                            </div>
                        </li>
                    <!-- End .single-comment-box -->
                    </ul></div>
                    <hr>
                    `)
            }

        });
}



// 댓글 생성
async function Create_Auction_Comment(){
    const content = document.getElementById("auction_comment_content").value
    
    const comment_data = {
        "content": content
    }
    const response3 = await fetch(`${backendBaseUrl}/auctions/${auction_id}/comments/`, {
        method : 'POST',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        body : JSON.stringify(comment_data)
    })
    response_json3 = await response3.json()
    if (response3.status == 201) {
        alert("댓글이 등록되었습니다.")
        window.location.reload()
    } else if (response3.status == 400) {
        alert(response_json3["message"])
    } else {
        alert("로그인한 사용자만 이용할 수 있습니다")
    }
    }



// 댓글 삭제
async function deleteComment(comment_id){
    var delConfirm = confirm("정말 댓글을 삭제하시겠습니까?")
    if (delConfirm) {
    const response = await fetch(`${backendBaseUrl}/auctions/${auction_id}/comments/${comment_id}/`, {
        method: 'DELETE',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
    })
    response_json = await response.json
        if (response.status === 200) {
            alert("댓글이 삭제되었습니다.")
            window.location.reload()
            return response_json
        }
}}

// 댓글 수정 GET(특정 댓글 가져오기)
async function getComment(){
    const response = await fetch(`${backendBaseUrl}/auctions/${auction_id}/comments/${comment_id}/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
    }
    )
    response_json = await response.json()

    if (response.status == 200) {
        let CommentDetailInfo = response_json
        return CommentDetailInfo

    }else {
        alert(response_json["error"])
    }
}


// 댓글 수정 POST
async function updatecomment(comment_id){
    const content = document.getElementById('auction_comment_content_update'+comment_id).value
    const comment_data = {
        "content": content
    }
    const response = await fetch(`${backendBaseUrl}/auctions/${auction_id}/comments/${comment_id}/`, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        body : JSON.stringify(comment_data)
    })
    response_json = await response.json()
    
    if (response.status == 200) {
        alert ("댓글이 수정되었습니다.")
        location.reload();
        return response_json

    }else {
        alert(response_json["error"])
    }
}
