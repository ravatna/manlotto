<!DOCTYPE html>
<html lang="en" ng-app="Lottery">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Lottery</title>
    <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/css/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../assets/css/sweetalert/sweetalert2.min.css?v=<?php echo time() ?>">
    <link rel="stylesheet" href="../assets/css/common.css?v=<?php echo time() ?>">
    <link rel="stylesheet" href="../assets/css/agent.css?v=<?php echo time() ?>">
</head>

<body>

    <ng-include src="'../assets/templates/agent/index.html'"></ng-include>

    <div id="modal-box"></div>

    <div data-loading id="loading-wrapper">
        <div id="loading-text">LOADING</div>
        <div id="loading-content"></div>
    </div>

    <script src="../assets/js/jquery-3.3.1.min.js"></script>
    <script src="../assets/js/bootstrap.min.js"></script>
    <script src="../assets/js/vendor.js?v=1.0"></script>
    <script src="../assets/js/agent.js?v=<?php echo time() ?>"></script>
</body>

</html>