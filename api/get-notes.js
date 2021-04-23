/**
 * Route: GET /notes
 */

 const AWS = require("aws-sdk"); 
 AWS.config.update({ region: 'eu-west-1' });

 const util = require('./util.js');
 
 const dynamodb = new AWS.DynamoDB.DocumentClient();
 const tableName = process.env.NOTES_TABLE;

 exports.handler = async(event) => {
     try{
         let query = event.queryStringParameters;
         let limit = query && query.limit ? parseInt(query.limit) : 5;
         let user_id = util.getUserId(event.headers);
         
         let params = {
            TableName: tableName,
            KeyConditionExpression: "user_id = :uuid",
            ExpressionAttributeValues: {
                ":uuid": user_id
            },
            Limit : limit,
            ScanIndexDorward: false
         };

         let startTimestamp = query && query.start ? parseInt(query.start) : 0;

         if(startTimestamp > 0){
             params.ExclusiveStartKey = {
                 user_id: user_id,
                 timestamp: startTimestamp
             }
         }

         let data = await dynamodb.query(params).promise();


        return{
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
        }
     } catch (err) {
        console.log("error", err);
        return{
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders,
            body: JSON.stringify ({
                error: err.name ? err.name : "Exception",
                message: err.name ? err.message : "Unknown error"
            })
        };
     }
 }