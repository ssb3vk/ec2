import express from 'express'
import AWS from 'aws-sdk'

const app = express()
app.set('json spaces', 2)

AWS.config.update({region: 'us-east-1'});
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {
        DryRun: false
};

app.listen(5001, () => console.log('Api running on port 5001'))

ec2.describeInstances(params, function(err, data) {
        if (err) {
                app.get('/', (req, res) => res.json('ERROR', err.stack));
        } else {
                app.get('/', (req, res) => res.json(data));
        }
});

