require('../bin/crawler')
('select tid,cmd from task where peding=1 and status=false and type=4 limit 1',true)