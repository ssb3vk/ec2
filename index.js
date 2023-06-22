import express from 'express'

import AWS from 'aws-sdk'
AWS.config.update({region: 'us-east-1'});

const app = express()
app.set('json spaces', 2)
app.listen(5001, () => console.log('Api running on port 5001'))


// Create an EC2 instance metadata client
const ec2metadata = new AWS.MetadataService();

// Function to retrieve the EC2 instance ID
const getInstanceId = () => {
  return new Promise((resolve, reject) => {
    ec2metadata.request('/latest/meta-data/instance-id', (err, data) => {
      if (err) {
        reject(err);

      } else {
        resolve(data);

      }

    });

  });

};


// Function to retrieve the EC2 instance details
const getInstanceDetails = (instanceId) => {
  return new Promise((resolve, reject) => {
    const ec2 = new AWS.EC2();

    const params = {
        InstanceIds: [instanceId],

    };

    ec2.describeInstances(params, (err, data) => {
      if (err) {
        reject(err);

      } else {
        resolve(data);

      }

    });

  });

};

// Retrieve the EC2 instance ID
getInstanceId()
  .then((instanceId) => getInstanceDetails(instanceId))
  .then((data) => {
    // Process the EC2 instance details
    const instanceDetails = data.Reservations[0].Instances[0];
    console.log('Instance ID:', instanceDetails.InstanceId);
    console.log('Instance Type:', instanceDetails.InstanceType);
    console.log('Availability Zone:', instanceDetails.Placement.AvailabilityZone);
    // Add more properties as needed

    // Additional processing or actions can be performed here
    app.get('/', (req, res) => res.json(data));

  })
  .catch((err) => {
    console.error('Error:', err);
  });
                                                                                                                  

