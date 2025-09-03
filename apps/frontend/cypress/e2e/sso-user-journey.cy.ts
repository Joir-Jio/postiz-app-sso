/**
 * Comprehensive E2E Tests for Complete SSO User Journey
 * Tests the entire user flow from external product to Postiz publishing
 */

describe('SSO User Journey', () => {
  const baseUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
  const backendUrl = 'http://localhost:3000';
  
  // Test data
  const testUser = {
    email: 'e2e-test@example.com',
    name: 'E2E Test User',
    externalUserId: 'external-e2e-user',
  };

  const testProduct = {
    productKey: 'video-gen-e2e',
    productName: 'Video Generation Tool E2E',
  };

  beforeEach(() => {
    // Setup test environment
    cy.task('setupTestDatabase');
    cy.task('createTestUser', testUser);
    cy.task('createTestProduct', testProduct);
    
    // Mock external APIs if needed
    cy.intercept('GET', '**/api/media/**', { fixture: 'media-list.json' }).as('getMedia');
    cy.intercept('POST', '**/api/posts/**', { fixture: 'post-created.json' }).as('createPost');
  });

  afterEach(() => {
    cy.task('cleanupTestData');
  });

  describe('Complete SSO Authentication Flow', () => {
    it('should complete full SSO flow from external product to Postiz dashboard', () => {
      // Step 1: Simulate external product initiating SSO
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        name: testUser.name,
        autoCreateUser: true,
        redirectUrl: '/launches?source=video-gen',
        metadata: {
          source: 'e2e-test',
          feature: 'video-publishing',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.authUrl).to.include('/seamless-login');

        const authUrl = response.body.data.authUrl;
        
        // Step 2: User clicks link and lands on seamless login page
        cy.visit(authUrl);
        
        // Should show loading state initially
        cy.get('[data-testid="sso-loader"]').should('be.visible');
        cy.get('[data-testid="loader-step"]').should('contain', 'validating');
        
        // Should progress through loading steps
        cy.get('[data-testid="loader-step"]', { timeout: 10000 })
          .should('contain', 'authenticating');
        
        cy.get('[data-testid="loader-step"]', { timeout: 10000 })
          .should('contain', 'redirecting');
        
        // Should eventually show success state
        cy.get('[data-testid="sso-success"]', { timeout: 15000 }).should('be.visible');
        cy.contains('Welcome to Postiz!').should('be.visible');
        cy.contains(testUser.name).should('be.visible');
        cy.contains('Video Generation Tool E2E').should('be.visible');
      });
    });

    it('should handle SSO with media references and preloaded content', () => {
      // Create test media references first
      cy.task('createTestMediaReferences', {
        userId: testUser.email,
        productKey: testProduct.productKey,
        mediaIds: ['media-1', 'media-2', 'media-3'],
      });

      // Initiate SSO with media references
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: true,
        mediaReferences: ['media-1', 'media-2'],
        preloadContent: {
          contentType: 'video',
          platforms: ['youtube', 'tiktok'],
        },
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        
        // Wait for authentication to complete
        cy.get('[data-testid="sso-success"]', { timeout: 15000 }).should('be.visible');
        
        // Should show media preloading information
        cy.contains('media files loaded').should('be.visible');
        cy.contains('2 media files').should('be.visible');
        
        // Continue to dashboard
        cy.get('a').contains('Continue to Postiz').click();
        
        // Should be redirected with preloaded content
        cy.url().should('include', '/launches');
        cy.get('[data-testid="preloaded-media"]').should('exist');
      });
    });

    it('should handle authentication errors gracefully', () => {
      // Create invalid SSO token
      const invalidToken = 'invalid.jwt.token';
      const invalidUrl = `${baseUrl}/seamless-login?token=${invalidToken}&challenge=invalid`;
      
      cy.visit(invalidUrl);
      
      // Should show error state
      cy.get('[data-testid="sso-error"]').should('be.visible');
      cy.contains('authentication link has expired').should('be.visible');
      
      // Should show retry option
      cy.get('[data-testid="retry-button"]').should('be.visible');
      
      // Should show support information
      cy.get('[data-testid="support-info"]').should('be.visible');
    });

    it('should handle expired tokens', () => {
      // Generate an expired token
      cy.task('generateExpiredSsoToken', {
        productKey: testProduct.productKey,
        email: testUser.email,
      }).then((expiredToken) => {
        const expiredUrl = `${baseUrl}/seamless-login?token=${expiredToken}&challenge=expired`;
        
        cy.visit(expiredUrl);
        
        // Should show error for expired token
        cy.get('[data-testid="sso-error"]').should('be.visible');
        cy.contains('expired').should('be.visible');
        
        // Retry should not work with expired token
        cy.get('[data-testid="retry-button"]').click();
        cy.get('[data-testid="sso-error"]').should('still.be.visible');
      });
    });
  });

  describe('Media Integration Flow', () => {
    beforeEach(() => {
      // Setup media test data
      cy.task('createTestMediaReferences', {
        userId: testUser.email,
        productKey: testProduct.productKey,
        mediaIds: ['video-1', 'image-1', 'audio-1'],
      });
    });

    it('should integrate external media into Postiz publishing workflow', () => {
      // Complete SSO authentication first
      cy.ssoAuthenticate(testUser, testProduct);
      
      // Navigate to new post creation
      cy.visit('/launches');
      cy.get('[data-testid="new-post-button"]').click();
      
      // Should see external media browser
      cy.get('[data-testid="external-media-browser"]').should('be.visible');
      cy.contains('Video Generation Tool E2E').should('be.visible');
      
      // Browse and select external media
      cy.get('[data-testid="media-item"]').should('have.length.at.least', 3);
      cy.get('[data-testid="media-item"]').first().click();
      
      // Should show media preview
      cy.get('[data-testid="media-preview"]').should('be.visible');
      cy.get('[data-testid="media-metadata"]').should('contain', 'video-1');
      
      // Add to post
      cy.get('[data-testid="add-media-button"]').click();
      
      // Should appear in post editor
      cy.get('[data-testid="post-media"]').should('contain', 'video-1');
      
      // Complete post creation
      cy.get('[data-testid="post-content"]').type('Test post with external media from Video Generator');
      cy.get('[data-testid="platform-selector"]').find('[data-platform="youtube"]').click();
      cy.get('[data-testid="publish-button"]').click();
      
      // Should create post successfully
      cy.get('[data-testid="success-message"]').should('contain', 'Post created successfully');
      cy.wait('@createPost').its('response.statusCode').should('eq', 200);
    });

    it('should handle media access permissions correctly', () => {
      // Create user with limited permissions
      cy.task('createTestUser', {
        ...testUser,
        email: 'limited-user@example.com',
        permissions: ['media:read'], // No write permissions
      });

      // Authenticate as limited user
      cy.ssoAuthenticate({
        ...testUser,
        email: 'limited-user@example.com',
      }, testProduct);
      
      cy.visit('/launches');
      cy.get('[data-testid="new-post-button"]').click();
      
      // Should see media but with limited actions
      cy.get('[data-testid="external-media-browser"]').should('be.visible');
      cy.get('[data-testid="media-item"]').first().click();
      
      // Should not have edit/delete options
      cy.get('[data-testid="edit-media-button"]').should('not.exist');
      cy.get('[data-testid="delete-media-button"]').should('not.exist');
      
      // But should be able to use in posts
      cy.get('[data-testid="add-media-button"]').should('be.visible');
    });

    it('should maintain data isolation between organizations', () => {
      // Create another organization and user
      cy.task('createTestUser', {
        email: 'other-org-user@example.com',
        name: 'Other Org User',
        organizationId: 'other-org-123',
      });

      cy.task('createTestMediaReferences', {
        userId: 'other-org-user@example.com',
        productKey: testProduct.productKey,
        organizationId: 'other-org-123',
        mediaIds: ['other-media-1', 'other-media-2'],
      });

      // Authenticate as original user
      cy.ssoAuthenticate(testUser, testProduct);
      
      cy.visit('/launches');
      cy.get('[data-testid="new-post-button"]').click();
      
      // Should only see own organization's media
      cy.get('[data-testid="media-item"]').should('have.length', 3); // Original user's media
      cy.get('[data-testid="media-item"]').should('not.contain', 'other-media-1');
      cy.get('[data-testid="media-item"]').should('not.contain', 'other-media-2');
    });
  });

  describe('Multi-Product Experience', () => {
    const secondProduct = {
      productKey: 'design-tool-e2e',
      productName: 'Design Tool E2E',
    };

    beforeEach(() => {
      cy.task('createTestProduct', secondProduct);
    });

    it('should handle user switching between products', () => {
      // Authenticate with first product
      cy.ssoAuthenticate(testUser, testProduct);
      cy.visit('/dashboard');
      
      // Verify branding for first product
      cy.get('[data-testid="product-branding"]').should('contain', 'Video Generation Tool E2E');
      
      // Simulate SSO from second product
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: secondProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: false,
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        
        // Should complete authentication quickly (existing user)
        cy.get('[data-testid="sso-success"]', { timeout: 10000 }).should('be.visible');
        cy.contains('Design Tool E2E').should('be.visible');
        
        // Continue to dashboard
        cy.get('a').contains('Continue to Postiz').click();
        
        // Should show updated branding context
        cy.get('[data-testid="sso-context"]').should('contain', 'design-tool-e2e');
      });
    });

    it('should handle cross-product logout', () => {
      // Authenticate with multiple products
      cy.ssoAuthenticate(testUser, testProduct);
      cy.ssoAuthenticate(testUser, secondProduct);
      
      cy.visit('/dashboard');
      
      // Initiate logout
      cy.get('[data-testid="logout-button"]').click();
      cy.get('[data-testid="confirm-logout"]').click();
      
      // Should handle cross-product logout
      cy.get('[data-testid="logout-progress"]').should('be.visible');
      cy.contains('Signing out from connected products').should('be.visible');
      
      // Should complete logout
      cy.url().should('include', '/auth');
      cy.get('[data-testid="login-form"]').should('be.visible');
    });
  });

  describe('Performance and Reliability', () => {
    it('should complete SSO flow within performance targets', () => {
      const startTime = Date.now();
      
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: false,
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        
        // Should complete within 3 seconds
        cy.get('[data-testid="sso-success"]', { timeout: 3000 }).should('be.visible').then(() => {
          const duration = Date.now() - startTime;
          expect(duration).to.be.lessThan(3000);
        });
      });
    });

    it('should handle concurrent authentications', () => {
      // Simulate multiple concurrent SSO requests
      const concurrentRequests = Array(5).fill(null).map((_, index) => 
        cy.request('POST', `${backendUrl}/api/sso/initiate`, {
          productKey: testProduct.productKey,
          email: `concurrent-${index}@example.com`,
          externalUserId: `concurrent-${index}`,
          autoCreateUser: true,
        })
      );

      // All should succeed
      cy.wrap(Promise.all(concurrentRequests)).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.be.true;
        });
      });
    });

    it('should handle network interruptions gracefully', () => {
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: false,
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        
        // Simulate network interruption during authentication
        cy.intercept('POST', '**/auth/sso/validate', { forceNetworkError: true }).as('networkError');
        
        // Should show error and retry option
        cy.get('[data-testid="sso-error"]').should('be.visible');
        cy.contains('Network error').should('be.visible');
        
        // Restore network and retry
        cy.intercept('POST', '**/auth/sso/validate').as('validateRetry');
        cy.get('[data-testid="retry-button"]').click();
        
        // Should eventually succeed
        cy.get('[data-testid="sso-success"]', { timeout: 10000 }).should('be.visible');
      });
    });

    it('should work on mobile devices', () => {
      // Set mobile viewport
      cy.viewport(375, 667); // iPhone SE
      
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: false,
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        
        // Should be responsive on mobile
        cy.get('[data-testid="sso-loader"]').should('be.visible');
        cy.get('[data-testid="loader-step"]').should('be.visible');
        
        // Success state should be mobile-friendly
        cy.get('[data-testid="sso-success"]', { timeout: 10000 }).should('be.visible');
        
        // Continue button should be accessible on mobile
        cy.get('a').contains('Continue to Postiz').should('be.visible').click();
        
        // Should navigate successfully
        cy.url().should('include', '/launches');
      });
    });
  });

  describe('Security Testing', () => {
    it('should reject invalid tokens', () => {
      const maliciousUrl = `${baseUrl}/seamless-login?token=malicious.token.here&challenge=hacker-attempt`;
      
      cy.visit(maliciousUrl);
      
      // Should show security error
      cy.get('[data-testid="sso-error"]').should('be.visible');
      cy.contains('authentication link has expired or is invalid').should('be.visible');
    });

    it('should sanitize redirect URLs', () => {
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: false,
        redirectUrl: 'javascript:alert("xss")', // XSS attempt
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        cy.get('[data-testid="sso-success"]', { timeout: 10000 }).should('be.visible');
        
        // Should sanitize malicious redirect
        cy.get('a').contains('Continue to Postiz').should('have.attr', 'href').and('not.contain', 'javascript:');
      });
    });

    it('should prevent CSRF attacks', () => {
      // Attempt to forge SSO request from different origin
      cy.origin('http://malicious-site.com', () => {
        cy.request({
          method: 'POST',
          url: `${backendUrl}/api/sso/initiate`,
          headers: {
            'Origin': 'http://malicious-site.com',
            'Referer': 'http://malicious-site.com/attack-page',
          },
          body: {
            productKey: testProduct.productKey,
            email: 'hacker@malicious-site.com',
            externalUserId: 'hacker-123',
            autoCreateUser: true,
          },
          failOnStatusCode: false,
        }).then((response) => {
          // Should be rejected due to CORS/CSRF protection
          expect(response.status).to.be.oneOf([403, 405, 400]);
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with keyboard navigation', () => {
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: false,
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        cy.get('[data-testid="sso-success"]', { timeout: 10000 }).should('be.visible');
        
        // Test keyboard navigation
        cy.get('body').tab(); // Should focus on continue button
        cy.focused().should('contain', 'Continue to Postiz');
        
        // Should work with Enter key
        cy.focused().type('{enter}');
        cy.url().should('include', '/launches');
      });
    });

    it('should have proper ARIA labels', () => {
      cy.request('POST', `${backendUrl}/api/sso/initiate`, {
        productKey: testProduct.productKey,
        email: testUser.email,
        externalUserId: testUser.externalUserId,
        autoCreateUser: false,
      }).then((response) => {
        const authUrl = response.body.data.authUrl;
        
        cy.visit(authUrl);
        cy.get('[data-testid="sso-success"]', { timeout: 10000 }).should('be.visible');
        
        // Check for proper accessibility attributes
        cy.get('img[alt]').should('have.length.at.least', 1);
        cy.get('[role="link"]').should('have.length.at.least', 1);
        cy.get('h1, h2, h3').should('have.length.at.least', 1);
      });
    });
  });
});

// Custom Cypress commands for SSO testing
Cypress.Commands.add('ssoAuthenticate', (user: any, product: any) => {
  return cy.request('POST', `${backendUrl}/api/sso/initiate`, {
    productKey: product.productKey,
    email: user.email,
    externalUserId: user.externalUserId,
    name: user.name,
    autoCreateUser: true,
  }).then((response) => {
    expect(response.body.success).to.be.true;
    
    const authUrl = response.body.data.authUrl;
    cy.visit(authUrl);
    cy.get('[data-testid="sso-success"]', { timeout: 15000 }).should('be.visible');
    cy.get('a').contains('Continue to Postiz').click();
    
    return response.body.data;
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      ssoAuthenticate(user: any, product: any): Chainable<any>;
    }
  }
}