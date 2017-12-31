import css from './css/index.css';
import less from './style/bg.less';
import sass from './style/main.scss';
let msg = 'hello';
let config = require('./config.json');
$('#title').html(config.name + msg);