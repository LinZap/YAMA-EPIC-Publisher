require('../bin/crawler')
('select tid,cmd from task where peding=0 and status=false and type=4 limit 1')
