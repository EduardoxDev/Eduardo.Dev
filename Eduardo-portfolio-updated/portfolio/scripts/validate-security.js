const fs = require('fs');
const path = require('path');

console.log('🔒 Security Validation Script\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function check(name, condition, type = 'error') {
  if (condition) {
    console.log(`✓ ${name}`);
    checks.passed++;
  } else {
    const symbol = type === 'warning' ? '⚠' : '✗';
    console.log(`${symbol} ${name}`);
    if (type === 'warning') checks.warnings++;
    else checks.failed++;
  }
}

console.log('Environment Variables:');
check('RESEND_API_KEY defined', !!process.env.RESEND_API_KEY, 'warning');
check('GITHUB_TOKEN defined', !!process.env.GITHUB_TOKEN, 'warning');
check('.env.example exists', fs.existsSync('.env.example'));

console.log('\nSecurity Files:');
check('SECURITY.txt exists', fs.existsSync('SECURITY.txt'));
check('CHANGELOG-SECURITY.txt exists', fs.existsSync('CHANGELOG-SECURITY.txt'));
check('.gitignore exists', fs.existsSync('.gitignore'));

console.log('\nAPI Routes:');
check('Contact route exists', fs.existsSync('app/api/contact/route.ts'));
check('GitHub route exists', fs.existsSync('app/api/github/route.ts'));
check('Test email route removed', !fs.existsSync('app/api/test-email/route.ts'));

console.log('\nConfiguration:');
check('middleware.ts exists', fs.existsSync('middleware.ts'));
check('next.config.mjs exists', fs.existsSync('next.config.mjs'));

console.log('\nCode Quality:');
const contactRoute = fs.readFileSync('app/api/contact/route.ts', 'utf8');
check('Contact route has rate limiting', contactRoute.includes('isRateLimited'));
check('Contact route has sanitization', contactRoute.includes('sanitize'));
check('Contact route has email validation', contactRoute.includes('validateEmail'));

const middleware = fs.readFileSync('middleware.ts', 'utf8');
check('Middleware has blocked paths', middleware.includes('BLOCKED_PATHS'));
check('Middleware has suspicious UA detection', middleware.includes('SUSPICIOUS_UA'));
check('Middleware has pattern detection', middleware.includes('SUSPICIOUS_PATTERNS'));

const nextConfig = fs.readFileSync('next.config.mjs', 'utf8');
check('Next.js has CSP', nextConfig.includes('Content-Security-Policy'));
check('Next.js has HSTS', nextConfig.includes('Strict-Transport-Security'));
check('Next.js has reactStrictMode', nextConfig.includes('reactStrictMode'));

console.log('\n' + '='.repeat(50));
console.log(`Results: ${checks.passed} passed, ${checks.failed} failed, ${checks.warnings} warnings`);

if (checks.failed > 0) {
  console.log('\n❌ Security validation failed!');
  process.exit(1);
} else if (checks.warnings > 0) {
  console.log('\n⚠️  Security validation passed with warnings');
  process.exit(0);
} else {
  console.log('\n✅ All security checks passed!');
  process.exit(0);
}
