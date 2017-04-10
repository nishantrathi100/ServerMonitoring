var express = require('express')
var app = express()
app.use(express.static('public'))

app.get('/stats/:startTime/:endTime/:duration', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(generateResponse(Number(req.params.startTime), Number(req.params.endTime), Number(req.params.duration), 'server1665'))
})

app.listen(3000, function () {
  console.log('Server monitoring app listening on port 3000!')
})

function generateResponse(startTime, endTime, duration, serverID) {
    function getRandomNumber(upperBound) {
        return Math.floor(Math.random() * upperBound);
    }

    var records = [],
        memUpperBound = 40000,
        throughputUpperBound = 20000,
        packetUpperBound = 1000,
        errorUpperBound = 5;

    for (var ts = startTime; ts < endTime; ts += 1000) {
        records.push({
            timestamp: (new Date(ts)).toISOString(),
            memory_usage: getRandomNumber(memUpperBound),
            memory_available: getRandomNumber(memUpperBound),
            cpu_usage: Math.random().toFixed(2),
            network_throughput: {
                "in": getRandomNumber(throughputUpperBound),
                out: getRandomNumber(throughputUpperBound)
            },
            network_packet: {
                "in": getRandomNumber(packetUpperBound),
                out: getRandomNumber(packetUpperBound)
            },
            errors: {
                system: getRandomNumber(errorUpperBound),
                sensor: getRandomNumber(errorUpperBound),
                component: getRandomNumber(errorUpperBound)
            }
        });
    }

    return {
        header: {
            target_name: serverID,
            time_range: {
                start: new Date(startTime).toISOString(),
                end: new Date(endTime).toISOString()
            },
            recordCount: records.length
        },
        data: records
    };
}
