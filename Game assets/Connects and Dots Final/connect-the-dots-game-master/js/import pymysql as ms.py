import pymysql as ms
conn=ms.connect(host='localhost',user='root',passwd='pass',database='stud')
cur = conn.cursor()
cur.execute('create table student(name varchar(20) not null,age int not null,roll_no int primary key)')
if conn.open==True:
    print("done")