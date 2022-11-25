
async function MypageView(){
    const response = await fetch(`${backendBaseUrl}/paintings/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()

    console.log(response_json);
    response_json.forEach(item => {
        $('#mypage').append(
            `
            <div class="col-xxl-4 col-xl-4 col-lg-6 col-md-6 mb-6">
                <div class="explore-style-one">
                    <div class="thumb">
                        <img src="${backendBaseUrl}${item.after_image}"alt="nft live auction thumbnail">
                            <!-- End .reaction-count -->
                    </div>
                    <!-- End .thumb -->
                    <div class="content">
                        <div class="header d-flex-between pt-4 pb-3">
                        <h3 class="title" style="text-align:center;">${item.title}</h3>
                        <div class="more-dropdown "><i class="ri-more-fill" data-bs-toggle="dropdown"></i>
                            <ul class="dropdown-menu dropdown-menu-dark">
                            <li><a class="dropdown-item" href="#">Edit</a></li>
                            <li><a class="dropdown-item" href="#">Delete</a></li>
                            </ul>
                        </div>
                        </div>
                        <!-- .header -->
                        <div class="action-wrapper d-flex-between pt-4">
                        <a href="#" id="${item.id}" onclick="Close_Show_Modal(this)" data-bs-toggle="modal" class="btn  btn-outline btn-small"><span><i class="ri-add-fill"></i>More</span></a>
                        </div>
                        <!-- action-wrapper -->
                    </div>
                    <!-- End .content -->
                </div>
            </div>

    
    <div id="${item.id}modal" style="display:none; z-index:9999;" >
    <div class="modal-dialog modal-dialog-centered" style="width:800px;">
      <div class="modal-content" style="height: 420px;">

        <div>
          <a type="button" id="${item.id}close"class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
              class="ri-close-fill"></i></a>
            <form action="#">
              <div class="create-item-wrapper" style="padding:35px 35px 20px 35px;">
                <div class="row">
                  <div class="col-lg-4"style='width:395px;'>
                    <!-- file upload area -->
                    <div class="upload-area">
      
                      <div class="brows-file-wrapper">
                        <input name="file" id="file" type="file" class="inputfile"
                          data-multiple-caption="{count} files selected" multiple />
                        <div style="height: 294px; width: 100%;">
                          <img src="${backendBaseUrl}${item.after_image}" style="width: 100%; height:100%; border-radius:10px; object-fit: cover">
                        </div>
                      </div>
                    </div>
                    <!-- end upoad file area -->
                  </div>
      
                  <div class="col-lg-8" style='width:365px;'>
                    <div class="form-field-wrapper" style="height:294px; overflow: auto;">
                      <div class="row">
                        <div class="col-md-12 mb-4">
                          <div class="field-box" style="display:flex; justify-content: space-between;">
                            <div class="form-label"><strong>Artist :</strong></div>
                            <!-- <input id="name" type="text" placeholder=""> -->
                            <div>새싹이</div>
                          </div>
                        </div>
                        <div class="col-md-12 mb-4">
                          <div class="field-box" style="display:flex; justify-content: space-between;">
                            <div class="form-label"><strong>Create :</strong></div>
                            <!-- <input id="name" type="text" placeholder=""> -->
                            <div>여기는 생성시간 넣기</div>
                          </div>
                        </div>
                        <div class="col-md-12 mb-4">
                          <div class="field-box">
                            <div class="form-label"><strong>Title</strong></div>
                            <!-- <input id="name" type="text" placeholder=""> -->
                            <div>${item.title}</div>
                          </div>
                        </div>
  
                        <div class="col-md-6 mb-4">
                          <div class="field-box">
                            <div class="form-label"><strong>Content :</strong></div>
                            <div>여기는 내용</div>
                          </div>
                        </div>       
                      </div>
                      <!-- End .row -->
                    </div>
                    <!--  -->
                  </div>
                </div>
                <!-- End .row -->
              </div>
              <!-- End .create-item-wrapper -->
              <div class="row">
                <div class="col-md-12" style="margin-left:-35px;">
                  <div class="d-flex-between flex-wrap">
                    <div class="d-flex-center ">
                      
                    </div>
                    <div class="input-box">
                      <a id="${item.id}" onclick="AuctionCreate(this)" class="btn btn-gradient btn-medium justify-content-center"><span>Create Item</span></a>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ENd .row -->
            </form>
        </div>

      </div>
      <!-- End .modal-content -->
    </div>
  </div>
            `
        )
    })
}





function Close_Show_Modal(id){
  var modal = document.getElementById(`${id.id}modal`);
  var close = document.getElementById(`${id.id}close`);

  modal.style.position = "fixed";

  modal.style.top =  "0";
  modal.style.left =  "0";

  modal.style.width =  "100%";
  modal.style.height =  "100%";
  
  modal.style.outline =  "0";
  modal.style.display = "block";



  const closeModal = () => {
    modal.style.display = "none";
    

}

  close.addEventListener("click", closeModal)
}



async function AuctionList(){
    const response = await fetch(`${backendBaseUrl}/auctions/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()

    console.log(response_json);
    response_json.forEach(item => {
        $('#action_list').append(
            `
            <div class="col-xxl-4 col-xl-4 col-lg-6 col-md-6 mb-6">
                <div class="explore-style-one">
                    <div class="thumb">
                    <a href="product-details.html"><img src="${backendBaseUrl}${item.painting.after_image}"
                        alt="nft live auction thumbnail"></a>
                    <button class="reaction-btn"><i class="ri-heart-fill"></i><span>${item.auction_like_count}</span></button>
                    <!-- End .reaction-count -->
                    </div>
                    <!-- End .thumb -->
                    <div class="content">
                    <div class="header d-flex-between pt-4 pb-3">
                        <h3 class="title"><a href="product-details.html">${item.painting.title}</a></h3>
                    </div>
                    <!-- .header -->
                    <div class="product-share-wrapper">
                    종료일&nbsp;&nbsp;&nbsp;<span id='remain-time' style='color:red;'>${item.end_date}</span>
                    </div>
                    <!-- End product-share-wrapper -->
                    <div class="product-owner py-4 d-flex-between">
                        <span class="bid-owner">Owned By <strong><a href="#">${item.painting.owner}</a></strong></span>
                        
                    </div>
                    <!-- End .product-owner -->
                    <div class="action-wrapper d-flex-between pt-4">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#bid_history"
                        class="history d-flex-center"><i class="ri-history-line"></i>View History</a>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#placeBit"
                        class="btn  btn-outline btn-small"><span><i class="ri-shopping-bag-line"></i> Place
                            Bid</span></a>
                    </div>
                    <!-- action-wrapper -->
                    </div>
                    <!-- End .content -->
                </div>
            </div>
            `
        )
    })
}
AuctionList()



function AuctionCreate(click_id){
  console.log(click_id.id)
  window.location.href = `/create.html?id=${click_id.id}`;
}