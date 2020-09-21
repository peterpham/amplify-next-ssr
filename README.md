# Amplify + NextJS with SSR

This is a sample project to use Amplify JS Library with NextJS with serverside rendering
Read more https://aws.amazon.com/blogs/mobile/ssr-support-for-aws-amplify-javascript-libraries/

IMPORTANT: This is not meant for Amplify Console deployment. The deployment will build NextJS project (using serverless framework), and deploy to S3 bucket and CloudFront.


### Set up

```
npm install
```

### Develop locally
```
npm run dev
```

### Deploy (via serverless)

```
npm run build
```

IMPORTANT: 
- Before running this command, make sure to uncheck "Block all public access" in account settings.
- When CloudFront distribution is created for the first time, it will take some time to deploy. Go to CloudFront console to check if the distribution is successful deployed before opening the CloudFront URL