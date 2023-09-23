CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    lottery_type VARCHAR(255),
    promotion_name VARCHAR(255),
    promotion_status VARCHAR(255),
    promotion_info TEXT,
    promotion_note TEXT,
    created_at datetime NULL,
    updated_at datetime NULL
);

CREATE TABLE credits (
    credit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    credit_type VARCHAR(255),
    credit_amount DECIMAL(10, 2),
    credit_note TEXT,
    credit_ref_id INT,
    created_at datetime NULL,
    updated_at datetime NULL
);


CREATE TABLE lottery (
    lottery_id INT AUTO_INCREMENT PRIMARY KEY,
    lottery_type VARCHAR(255),
    lottery_date DATE,
    lottery_status VARCHAR(255),
    lottery_options TEXT,
    open_date DATETIME,
    close_date DATETIME,
    created_at datetime NULL,
    updated_at datetime NULL
);


CREATE TABLE receive_limit (
    limit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    lottery_type VARCHAR(255),
    lottery_id INT,
    limit_option TEXT,
    created_at datetime NULL,
    updated_at datetime NULL
);


CREATE TABLE lottery_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    lottery_id INT,
    receive DECIMAL(10, 2),
    commission DECIMAL(10, 2),
    win DECIMAL(10, 2),
    diff_win DECIMAL(10, 2),
    created_at datetime NULL,
    updated_at datetime NULL
);


CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    lottery_id INT,
    total_amount DECIMAL(10, 2),
    result_amount DECIMAL(10, 2),
    status VARCHAR(255),
    created_at datetime NULL,
    updated_at datetime NULL
);


CREATE TABLE ticket_numbers (
    t_number_id INT AUTO_INCREMENT PRIMARY KEY,
    lottery_id INT,
    ticket_id INT,
    t_type VARCHAR(255),
    t_number VARCHAR(255),
    t_pay DECIMAL(10, 2),
    t_amount DECIMAL(10, 2),
    t_return DECIMAL(10, 2),
    t_result DECIMAL(10, 2),
    created_at datetime NULL,
    updated_at datetime NULL
);


CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_role VARCHAR(255),
    username VARCHAR(255),
    password varchar(255),
    fullname VARCHAR(255),
    abb VARCHAR(255),
    tel VARCHAR(255),
    line VARCHAR(255),
    status VARCHAR(255),
    created_at datetime NULL,
    updated_at datetime NULL
);

INSERT INTO users (user_role, username, password, fullname, abb, tel, line, status, created_at, updated_at) VALUES ('administrator', 'admin', MD5('admin'), 'Administrator 1', 'Admin1', '123456789', 'admin_line', 'active', NOW(), NOW())
