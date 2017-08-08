var request = require('request');
var cmd=require('node-cmd');

var fetch_publish_url = 'http://demo.xinqigu.com/api/live/create';
// var fetch_publish_url = 'http://192.168.1.183/api/live/create';

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
};

var headers = {
 'Accept': 'application/x.edu.v1.0.1+json'
}
var devices = [
    'USB2.0 PC CAMERA'
]
var form = {
    name: '测试实验室2号',
    uuid: 'windows_00000001',
    type: '2'
};

// 创建直播流
var start = function(fetch_publish_url, form, timeout, filePath){
    return new Promise(function(resolve, reject){
        request.post(fetch_publish_url, {
            headers: headers,
            form: form
        }, function(err, response, body){
            if(!err && response.statusCode == 200){
                resolve({body: body, path: filePath});
            }else{
                console.log('statusCode: ' + response.statusCode)
                setTimeout(function(){
                    start(fetch_publish_url, form, timeout, filePath).then(function(body, path){
                        resolve({body: body, path: path});
                    });
                }, timeout);
            }
        });
    });
}


// ffmpeg -f dshow -i video="USB2.0 PC CAMERA" -vcodec libx264 -f flv "rtmp://pili-publish.xinqigu.com/education-live/control_936ae4df35def94475adee5ef46b2d9e_0?e=1502078776&token=FLyjJ-r-pHxLMRETyMHSVCK0lUa_6VnjMyd1aDtn:nqUrGaikVt9XPBmtDPfgoga6JQ8="

// 推送视频流
function start_command(publish_url, path){
    var command = 'ffmpeg' + ' ' +
                  '-f dshow' + ' ' +
                  '-i video=' + "\"" + path + "\"" + " " +
                  '-vcodec libx264' + " " +
                  '-b:v 1024k' + " " +
                  '-r 30' + ' ' +
                  '-f flv' + " " +
                  '\"' + publish_url + "\"";

    console.log(command);
    cmd.run(command)
    // if (cmd.run(command).code !== 0) {
    //   console.log('ffmpeg error!');
    //   exit(1);
    // }
//     var command = ffmpeg();
//     command
//     // .input(path)
//     .inputOptions(['-f dshow', ['-i video='+ "\"" +path + "\""]])
// //    .inputFormat('video')
// //    .inputOptions(['-s 320*300'])
//     .on('start', function(commandLine){
//         console.log('Spawned FFmpeg with command:' + commandLine);
//     }).on('error', function(err, stdout, stderr){
//         console.log('error:' + err.message);
//         console.log('stdout:' + stdout);
//         console.log('stderr:' + stderr);
//     }).on('end', function(){
//         console.log('Processing finished!');
//     })
//     //.size('320x300')
//     .videoCodec('libx264')
//     .videoBitrate(1024) // 比特率 1024
//     .format('flv')
//     .fps(30)
//     .output(publish_url, { end: true }).run();
}


/**
* 遍历文件，创建视频流，并开启推送视频流
**/
// var pattern = '/dev/video**';
// glob(pattern, {nodir: true}, function (err, files) {
//     if (!err) {
//     }
// })

var len = devices.length;
// 遍历所有的摄像头挂载文件
for (var i = 0; i < len; i++) {
    form['index'] = i;
    var filePath = devices[len - i -1];
    console.log(filePath);
    start(fetch_publish_url, form, 5000, filePath).then(function(data){
        // console.log(data['body']);
        // console.log(data['path']);
    
        var json = JSON.parse(data['body']);
        start_command(json.publish_url, data['path']);
        // 睡眠
        sleep(5000);
    });
}