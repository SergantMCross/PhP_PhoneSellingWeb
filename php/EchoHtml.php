<?php
session_start();

// Add topnav to page
function AddTopNav()
{
    echo '
	<div class="top-nav group">
        <section>
            <div class="social-top-nav">
                <a class="fa fa-facebook"></a>
                <a class="fa fa-twitter"></a>
                <a class="fa fa-google"></a>
                <a class="fa fa-youtube"></a>
            </div> <!-- End Social Topnav -->

            <ul class="top-nav-quicklink flexContain">
                <li><a href="index.php"><i class="fa fa-home"></i> Home</a></li>
                <li><a href=""><i class="fa fa-newspaper-o"></i> News</a></li>
                <li><a href=""><i class="fa fa-handshake-o"></i> Careers</a></li>
                <li><a href=""><i class="fa fa-info-circle"></i> About</a></li>
                <li><a href=""><i class="fa fa-wrench"></i> Warranty</a></li>
                <li><a href=""><i class="fa fa-phone"></i> Contact</a></li>
            </ul> <!-- End Quick link -->
        </section><!-- End Section -->
    </div><!-- End Top Nav  -->';
}

// Add header
function AddHeader()
{
    echo '        
	<div class="header group">
        <div class="smallmenu" id="openmenu" onclick="Smallmenu(1)">≡</div>
        <div style="display: none;" class="smallmenu" id="closemenu" onclick="Smallmenu(0)">×</div>
        <div class="logo">
            <a href="index.php">
                <img src="img/logo.jpg" alt="Home Smartphone Store" title="Home Smartphone Store">
            </a>
        </div> <!-- End Logo -->

        <div class="content">
            <div class="search-header">
                <form class="input-search" method="get" action="index.php">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Enter search keywords...">
                        <button type="submit">
                            <i class="fa fa-search"></i>
                            Search
                        </button>
                    </div>
                </form> <!-- End Form search -->
                <div class="tags">
                    <strong>Keywords: </strong>
                </div>
            </div> <!-- End Search header -->

            <div class="tools-member">
                <div class="member">
                    <a onclick="CheckTaiKhoan()" id="btnTaiKhoan">
                        <i class="fa fa-user"></i>
                        Account
                    </a>
                    <div class="menuMember hide">
                        <a href="User.php">User page</a>
                        <a onclick="CheckDangXuat();">Logout</a>
                    </div>
                </div> <!-- End Member -->

                <div class="cart">
                    <a href="Cart.php">
                        <i class="fa fa-shopping-cart"></i>
                        <span>Cart</span>
                        <span class="cart-number"></span>
                    </a>
                </div> <!-- End Cart -->

                <!-- <div class="check-order">
                    <a>
                        <i class="fa fa-truck"></i>
                        <span>Orders</span>
                    </a>
                </div>  -->
            </div><!-- End Tools Member -->
        </div> <!-- End Content -->
    </div> <!-- End Header -->';
}

// Add home
function AddHome()
{
    echo '
    <div class="banner">
        <div class="owl-carousel owl-theme"></div>
    </div> <!-- End Banner -->
    
    <div class="smallbanner" style="width: 100%;"></div>

    <div class="companysFilter">
        <button class="companysButton" onclick="SetCompanysMenu()">
            <p>Brand</p>
            <div id="iconOpenMenu">▷</div>
            <div id="iconCloseMenu" style="display: none;">▽</div>
        </button>
    </div>
    <div class="companyMenu group flexContain"></div>

    <div class="timNangCao">
        <div class="flexContain">
            <div class="pricesRangeFilter dropdown">
                <button class="dropbtn">Price</button>
                <div class="dropdown-content"></div>
            </div>

            <div class="promosFilter dropdown">
                <button class="dropbtn">Promotion</button>
                <div class="dropdown-content"></div>
            </div>

            <div class="starFilter dropdown">
                <button class="dropbtn">Star rating</button>
                <div class="dropdown-content"></div>
            </div>

            <div class="sortFilter dropdown">
                <button class="dropbtn">Sort</button>
                <div class="dropdown-content"></div>
            </div>            
        </div>
        
        <div>
            <input type="text" class="js-range-slider" id="demoSlider">
        </div>

    </div> <!-- End filter selection -->

    <div class="choosedFilter flexContain"></div> <!-- Selected filters -->
    <hr>

    <!-- Hidden by default, shown when filters are applied -->
    <div class="contain-products" style="display:none">
    <div class="filterName">
        <div id="divSoLuongSanPham"></div>
        <input type="text" placeholder="Filter by name..." onkeyup="FilterProductsName(this)">
        <div class="loader" style="display: none"></div>
    </div> <!-- End FilterName -->

    <ul id="products" class="homeproduct group flexContain">
        <div id="khongCoSanPham">
            <i class="fa fa-times-circle"></i>
            No products found
        </div> <!-- End No products found -->
    </ul><!-- End products -->

    <div class="pagination"></div>
    </div>

    <!-- Div displaying hot products, promotions, new arrivals ... -->
    <div class="contain-khungSanPham"></div>';
}

// Add product details
function AddChiTietSanPham()
{
    echo '
    <div class="chitietSanpham" style="min-height: 85vh">
        <h1>Phone </h1>
        <div class="rowdetail group">
            <div class="picture">
                <img src="">
            </div>
            <div class="price_sale">
                <div class="area_price"> </div>
                <div class="ship" style="display: none;">
                    <i class="fa fa-clock-o"></i>
                    <div>RECEIVE WITHIN 1 HOUR</div>
                </div>
                <div class="area_promo">
                    <strong>promotion</strong>
                    <div class="promo">
                        <i class="fa fa-check-circle"></i>
                        <div id="detailPromo"> </div>
                    </div>
                </div>
                <div class="policy">
                    <div>
                        <i class="fa fa-archive"></i>
                        <p>In the box: Charger, Headphones, User manual, SIM ejector tool, Protective case</p>
                    </div>
                    <div>
                        <i class="fa fa-star"></i>
                        <p>Official warranty 12 months.</p>
                    </div>
                    <div class="last">
                        <i class="fa fa-retweet"></i>
                        <p>1-for-1 exchange within 1 month if defective, product exchange at home within 1 day.</p>
                    </div>
                </div>
                <div class="area_order">
                    <!-- nameProduct is a global variable initialized in phanTich_URL_chiTietSanPham -->
                    <a class="buy_now" onclick="ThemVaoGioHang(MaProduct, NameProduct);">
                        <h3><i class="fa fa-plus"></i> Add to cart</h3>
                    </a>
                </div>
            </div>
            <div class="info_product">
                <h2>Specifications</h2>
                <ul class="info">

                </ul>
            </div>
        </div>
        <hr>
        <div class="comment-area">
            <div class="guiBinhLuan">
                <div class="stars">
                    <form action="">
                        <input class="star star-5" id="star-5" value="5" type="radio" name="star"/>
                        <label class="star star-5" for="star-5" title="Excellent"></label>

                        <input class="star star-4" id="star-4" value="4" type="radio" name="star"/>
                        <label class="star star-4" for="star-4" title="Good"></label>

                        <input class="star star-3" id="star-3" value="3" type="radio" name="star"/>
                        <label class="star star-3" for="star-3" title="Average"></label>

                        <input class="star star-2" id="star-2" value="2" type="radio" name="star"/>
                        <label class="star star-2" for="star-2" title="Fair"></label>

                        <input class="star star-1" id="star-1" value="1" type="radio" name="star"/>
                        <label class="star star-1" for="star-1" title="Poor"></label>
                    </form>
                </div>
                <textarea maxlength="250" id="inpBinhLuan" placeholder="Write your thoughts here..."></textarea>
                <input id="btnBinhLuan" type="button" onclick="CheckGuiBinhLuan()" value="SUBMIT COMMENT">
            </div>
            <!-- <h2>Comments</h2> -->
            <div class="container-comment">
                <div class="rating"></div>
                <div class="comment-content">
                </div>
            </div>
        </div>
    </div>';
}

// Add footer
function AddFooter()
{
    echo '
    <!-- ============== Alert Box ============= -->
    <div id="alert">
        <span id="closebtn">&otimes;</span>
    </div>

    <!-- ============== Footer ============= -->
    <div class="copy-right">
        <p>
            All rights reserved © 2018-' . date("Y") . ' - Designed by
            <span style="color: #eee; font-weight: bold">H-group</span>
        </p>
    </div>';
}

// Add account container
function AddContainTaiKhoan()
{
    echo '
	<div class="containTaikhoan">
    <span class="close" onclick="ShowTaiKhoan(false);">&times;</span> 
        <div class=" taikhoan">
            <ul class="tab-group">
                <li class="tab active"><a href="#login">Login</a></li>
                <li class="tab"><a href="#signup">Sign up</a></li>
            </ul> <!-- /tab group -->
            <div class="tab-content">
                <div id="login">
                    <h1>Welcome back!</h1>
                    <!-- <form onsubmit="return logIn(this);"> -->
                    <form action="" method="post" name="formDangNhap" onsubmit="return CheckDangNhap();">
                        <div class="field-wrap">
                            <label>
                                Username<span class="req">*</span>
                            </label>
                            <input name="username" type="text" id="username" required autocomplete="off" />
                        </div> <!-- /user name -->
                        <div class="field-wrap">
                            <label>
                                Password<span class="req">*</span>
                            </label>
                            <input name="pass" type="password" id="pass" required autocomplete="off" />
                        </div> <!-- pass -->
                        <p class="forgot"><a href="#">Forgot password?</a></p>
                        <button type="submit" class="button button-block" />Continue</button>
                    </form> <!-- /form -->
                </div> <!-- /log in -->
                <div id="signup">
                    <h1>Sign up free</h1>
                    <!-- <form onsubmit="return signUp(this);"> -->
                    <form action="" method="post" name="formDangKy" onsubmit="return CheckDangKy();">
                        <div class="top-row">
                            <div class="field-wrap">
                                <label>
                                    Last name<span class="req">*</span>
                                </label>
                                <input name="ho" type="text" id="ho" required autocomplete="off" />
                            </div>
                            <div class="field-wrap">
                                <label>
                                    First name<span class="req">*</span>
                                </label>
                                <input name="ten" id="ten" type="text" required autocomplete="off" />
                            </div>
                        </div> <!-- / ho ten -->
                        <div class="top-row">
                            <div class="field-wrap">
                                <label>
                                    Phone<span class="req">*</span>
                                </label>
                                <input name="sdt" id="sdt" type="text" pattern="\d*" minlength="10" maxlength="12" required autocomplete="off" />
                            </div> <!-- /sdt -->
                            <div class="field-wrap">
                                <label>
                                    Email<span class="req">*</span>
                                </label>
                                <input name="email" id="email" type="email" required autocomplete="off" />
                            </div> <!-- /email -->
                        </div>
                        <div class="field-wrap">
                            <label>
                                Address<span class="req">*</span>
                            </label>
                            <input name="diachi" id="diachi" type="text" required autocomplete="off" />
                        </div> <!-- /user name -->
                        <div class="field-wrap">
                            <label>
                                Username<span class="req">*</span>
                            </label>
                            <input name="newUser" id="newUser" type="text" required autocomplete="off" />
                        </div> <!-- /user name -->
                        <div class="field-wrap">
                            <label>
                                Password<span class="req">*</span>
                            </label>
                            <input name="newPass" id="newPass" type="password" required autocomplete="off" />
                        </div> <!-- /pass -->
                        <button type="submit" class="button button-block" />Create account</button>
                    </form> <!-- /form -->
                </div> <!-- /sign up -->
            </div><!-- tab-content -->
        </div> <!-- /taikhoan -->
    </div>
';
}

// Add plc (intro section before footer)
function AddPlc()
{
    echo '
    <div class="plc">
        <section>
            <ul class="flexContain">
                <li>Express delivery within 1 hour</li>
                <li>Flexible payment: cash, visa / mastercard, installment</li>
                <li>Try products at home</li>
                <li>Free exchange at home within 1 day</li>
                <li>Support throughout usage.
                    <br>Hotline:
                    <a href="tel:12345678" style="color: #288ad6;">1234.5678</a>
                </li>
            </ul>
        </section>
    </div>';
}