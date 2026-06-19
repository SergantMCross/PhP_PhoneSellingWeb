<head>
    <link rel="stylesheet" href="css/login.css">
    <!-- <link rel="stylesheet" href="css/bootstrap.min.css"> -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Jquery -->
    <script src="lib/Jquery/Jquery.min.js"></script>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>

    <script>
        
function KiemTraDangNhap(){
    A=document.getElementById("username").value;
    B=document.getElementById("password").value;
    if(A == "")
        {
            alert("Username cannot be empty! Please enter your username.");
            form.username.focus();
            return false;
        }
    if(B == "")
        {
            alert("Password cannot be empty! Please enter your password.");
            form.password.focus();
            return false;
        }
    $.ajax({
        url:"php/ProcessAdminLogin.php",
        type:"post",
        data: {
            data_username:A,
            data_password:B
        },
        //async:true,
        success:function(Kq){
            if(Kq.indexOf("yes")!= -1) 
                {
                    alert("Login successful");
                    window.location="Admin.php";
                }
             else {
                alert("Please check again");
                document.getElementById("username").value="";
                document.getElementById("password").value="";
                form.username.focus();
             }
            // }
        }

    });
}
    </script>

</head>
 <body class="main-bg" id="hienthiadmin">
        <div class="login-container text-c animated flipInX">
                <div>
                    <h1 class="logo-badge text-whitesmoke"><span class="fa fa-user-circle"></span></h1>
                </div>
                    <h3 class="text-whitesmoke">Admin Login</h3>
                    <p class="text-whitesmoke"></p>
                <div class="container-content">
                    <form action="" method="post" name="form" class="margin-t">
                        <div class="form-group">
                            <input name="username" id="username" type="text" class="form-control" placeholder="Username" required="">
                        </div>
                        <div class="form-group">
                            <input name="password" id="password" type="password" class="form-control" placeholder="*****" required="">
                        </div>
                        <button type="button" class="form-button button-l margin-b" onclick="KiemTraDangNhap()">Sign In</button>

                        <div id="hienthiketqua"></div>
                        <!-- Handle login with database account information -->

                        <!-- <a class="text-darkyellow" href="#"><small>Forgot your password?</small></a> -->
                        <!-- <p class="text-whitesmoke text-center"><small>Do not have an account?</small></p> -->
                    </form>
                    <!-- <p class="margin-t text-whitesmoke"><small> Your Name &copy; 2019</small> </p> -->
                </div>
            </div>  
            </body>

