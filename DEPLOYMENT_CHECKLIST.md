# Deployment Checklist

## Pre-Deployment

### 1. Local Testing
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run dev` and test all features work with mock data
- [ ] Test gap scanner displays data correctly
- [ ] Test charts render properly
- [ ] Create test alerts and verify they work
- [ ] Check browser notifications are working
- [ ] Test on mobile/tablet view (responsive design)
- [ ] Test dark/light theme switching
- [ ] Check console for any errors

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] If using backend API, set `NEXT_PUBLIC_API_URL`
- [ ] If using WebSocket, set `NEXT_PUBLIC_WS_URL`
- [ ] Test with real API if available
- [ ] Verify mock data fallback works if API fails

### 3. Code Quality
- [ ] Run `npm run lint` and fix any errors
- [ ] Run `npm run build` to check for build errors
- [ ] Review TypeScript errors (if any)
- [ ] Remove any debug `console.log` statements (except `[v0]` ones)
- [ ] Check that all components render without warnings

### 4. Backend API (if using)
- [ ] Backend endpoints match required schemas (see BACKEND_INTEGRATION_GUIDE.md)
- [ ] API returns data in correct format
- [ ] CORS is configured correctly
- [ ] Rate limiting is in place
- [ ] Error handling returns proper status codes
- [ ] Authentication is working (if required)

## Deployment

### Option 1: Vercel (Recommended)

1. **Prepare Repository**
   - [ ] Push code to GitHub/GitLab/Bitbucket
   - [ ] Ensure `.env.local` is in `.gitignore` (it is by default)
   - [ ] Commit all changes

2. **Deploy to Vercel**
   - [ ] Go to [vercel.com](https://vercel.com)
   - [ ] Import your repository
   - [ ] Add environment variables in Vercel dashboard:
     - `NEXT_PUBLIC_API_URL` (if using)
     - `BACKEND_API_KEY` (if needed)
     - Any other required env vars
   - [ ] Click Deploy

3. **Post-Deployment**
   - [ ] Visit your deployed URL
   - [ ] Test all features in production
   - [ ] Check that API calls work
   - [ ] Verify alerts system works
   - [ ] Test on multiple devices/browsers

### Option 2: Docker

1. **Build Docker Image**
   ```bash
   docker build -t gap-analysis-tool .
   ```
   - [ ] Build completes without errors

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_API_URL=your-api-url \
     gap-analysis-tool
   ```
   - [ ] Container starts successfully
   - [ ] App is accessible at http://localhost:3000

3. **Deploy to Production**
   - [ ] Push image to registry (Docker Hub, AWS ECR, etc.)
   - [ ] Deploy to your hosting platform
   - [ ] Configure load balancer/reverse proxy
   - [ ] Set up SSL certificate

### Option 3: VPS/Cloud Server

1. **Prepare Server**
   - [ ] Install Node.js 20+
   - [ ] Install PM2 or similar process manager
   - [ ] Set up nginx as reverse proxy
   - [ ] Configure firewall

2. **Deploy Application**
   ```bash
   git clone <your-repo>
   cd stockgapanalysistool
   npm install
   npm run build
   ```
   - [ ] Build completes successfully

3. **Start Application**
   ```bash
   pm2 start npm --name "gap-trader" -- start
   pm2 save
   pm2 startup
   ```
   - [ ] App starts without errors
   - [ ] PM2 configured for auto-restart

4. **Configure Nginx**
   - [ ] Set up reverse proxy to port 3000
   - [ ] Configure SSL with Let's Encrypt
   - [ ] Test https access

## Post-Deployment

### 1. Functionality Testing
- [ ] Gap scanner loads and displays data
- [ ] Charts render correctly
- [ ] Alerts can be created
- [ ] Notifications work (after enabling)
- [ ] Navigation works on all pages
- [ ] Theme switcher works
- [ ] Command palette (⌘K) works
- [ ] Responsive design works on mobile

### 2. Performance
- [ ] Page load time < 3 seconds
- [ ] API calls complete in reasonable time
- [ ] No memory leaks (check browser dev tools)
- [ ] Charts render smoothly
- [ ] No layout shifts

### 3. Monitoring Setup
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Vercel Analytics already included)
- [ ] Set up uptime monitoring
- [ ] Configure alerts for API failures
- [ ] Monitor API rate limits

### 4. Security
- [ ] API keys are in environment variables (not in code)
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] No sensitive data in browser console
- [ ] CSP headers configured (if needed)

### 5. Documentation
- [ ] Update README with production URL
- [ ] Document any custom backend setup
- [ ] Add API documentation (if applicable)
- [ ] Document environment variables
- [ ] Create user guide (if needed)

## Backend Integration Checklist

If you're connecting to a real backend API:

### API Endpoints Required
- [ ] `GET /api/gaps` - Returns array of GapData
- [ ] `GET /api/gaps/:symbol` - Returns single GapData
- [ ] `GET /api/news` - Returns array of NewsItem
- [ ] `GET /api/chart/:symbol` - Returns array of ChartData
- [ ] `POST /api/backtest/:symbol` - Returns BacktestResult
- [ ] `GET /api/fill-rate/:symbol` - Returns fill rate data

### Optional Backend Features
- [ ] `GET /api/alerts` - For alert storage
- [ ] `POST /api/alerts` - Create alert
- [ ] `PATCH /api/alerts/:id` - Update alert
- [ ] `DELETE /api/alerts/:id` - Delete alert
- [ ] WebSocket endpoint for real-time updates
- [ ] Trade journal endpoints

### Data Quality
- [ ] Gap data includes all required fields
- [ ] Historical fill rates are accurate
- [ ] Sentiment scores are realistic (0-1)
- [ ] Chart data has proper timestamps
- [ ] Volume data is accurate

## Troubleshooting

### Common Issues

**"No gaps detected"**
- Check if API is returning data
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check browser console for API errors
- Test with mock data first

**"Notifications not working"**
- Check browser notification permissions
- Test in different browsers (Safari has limitations)
- Ensure HTTPS is enabled (required for notifications)
- Check browser console for errors

**"Charts not rendering"**
- Verify chart data format matches ChartData interface
- Check for console errors
- Test with mock data first
- Ensure lightweight-charts is properly installed

**"API timeout errors"**
- Check backend response time
- Increase timeout in api-client.ts
- Verify network connectivity
- Check for CORS issues

**"Build fails"**
- Run `npm install` again
- Check for TypeScript errors
- Verify all imports are correct
- Check Node.js version (needs 20+)

## Production Monitoring

### Metrics to Track
- [ ] API response times
- [ ] Error rates
- [ ] User engagement
- [ ] Alert trigger frequency
- [ ] Chart render performance
- [ ] Mobile vs desktop usage

### Regular Maintenance
- [ ] Weekly: Check error logs
- [ ] Weekly: Review API performance
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review user feedback
- [ ] Quarterly: Performance audit
- [ ] Quarterly: Security audit

## Success Criteria

Your deployment is successful when:
- [ ] All features work in production
- [ ] No console errors
- [ ] Page load time < 3s
- [ ] API calls complete successfully
- [ ] Alerts trigger correctly
- [ ] Mobile experience is smooth
- [ ] No memory leaks after extended use
- [ ] Backend integration works (if applicable)
- [ ] 80%+ uptime achieved

## Next Steps After Deployment

1. **Monitor Performance**: Track API response times and error rates for the first week
2. **Gather Feedback**: Test the tool with real trading scenarios
3. **Iterate**: Fix any issues that come up in production
4. **Scale**: Add more features based on usage patterns
5. **Document**: Keep notes on what works and what doesn't for gap trading

## Support Resources

- **Backend Integration**: See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)
- **General Info**: See [README.md](./README.md)
- **API Docs**: Check your backend documentation
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

Remember: Test thoroughly before trading with real money! This is a tool to assist your analysis, not automated trading advice.
