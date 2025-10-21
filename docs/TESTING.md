# Testing Procedures - Weight Balance

## Testing Overview

This document outlines comprehensive testing procedures for the Weight Balance game, focusing on the minimal physics prototype (v0.1.0) with plans for future expansion.

## Manual Test Cases - Minimal Prototype

### Test Environment Setup
- **Browser**: Chrome, Firefox, Safari (latest 2 versions)
- **Resolution**: 1920x1080, 1366x768, 1440x900
- **Hardware**: Minimum 4GB RAM, integrated graphics
- **Network**: Local development server

### Test Case 1: Application Startup
**Objective**: Verify application loads correctly

**Steps**:
1. Open browser to `http://localhost:5173`
2. Wait for application to load
3. Verify canvas is visible and rendered

**Expected Results**:
- [ ] Application loads without errors
- [ ] Canvas displays 3D scene
- [ ] Base platform is visible
- [ ] Camera positioned correctly
- [ ] No console errors
- [ ] 60fps performance maintained

**Pass Criteria**: All expected results achieved

### Test Case 2: Physics Simulation
**Objective**: Verify physics engine is working correctly

**Steps**:
1. Observe initial scene
2. Check for any falling objects
3. Verify gravity is applied correctly

**Expected Results**:
- [ ] No objects falling initially
- [ ] Physics world is stable
- [ ] No physics glitches or errors
- [ ] Performance remains at 60fps

**Pass Criteria**: Stable physics simulation

### Test Case 3: Cube Creation
**Objective**: Test cube creation system

**Steps**:
1. Open browser console
2. Execute: `createCube(1, 0, 0, 0)` (weight 1 at origin)
3. Execute: `createCube(5, 2, 0, 2)` (weight 5 at position 2,0,2)
4. Verify cubes appear and fall

**Expected Results**:
- [ ] Weight 1 cube: Small, light blue, shows "1"
- [ ] Weight 5 cube: Large, red, shows "5"
- [ ] Cubes fall with realistic physics
- [ ] Weight differences affect falling behavior
- [ ] No creation errors

**Pass Criteria**: All cube types created correctly

### Test Case 4: Surface Placement
**Objective**: Test cube placement on surfaces

**Steps**:
1. Click on platform surface
2. Verify cube appears at click location
3. Click on top of placed cube
4. Verify second cube stacks on first

**Expected Results**:
- [ ] Click on platform places cube correctly
- [ ] Click on cube top places cube on top
- [ ] Placement respects surface constraints
- [ ] No placement outside valid areas
- [ ] Visual feedback for valid placement

**Pass Criteria**: Placement system works correctly

### Test Case 5: Camera Controls
**Objective**: Test camera orbit and zoom

**Steps**:
1. Click and drag to orbit camera
2. Use mouse wheel to zoom in/out
3. Test camera limits and smoothness

**Expected Results**:
- [ ] Mouse drag orbits camera smoothly
- [ ] Camera stays focused on scene center
- [ ] Zoom in/out works correctly
- [ ] Zoom limits prevent extreme views
- [ ] No camera jumping or glitches

**Pass Criteria**: Intuitive camera controls

### Test Case 6: Tower Stability
**Objective**: Test tower building and stability

**Steps**:
1. Place 3-4 cubes in a stack
2. Observe tower stability
3. Add more cubes until tower falls
4. Verify fall detection works

**Expected Results**:
- [ ] Cubes stack naturally
- [ ] Tower remains stable when balanced
- [ ] Tower falls when unstable
- [ ] Fall detection triggers immediately
- [ ] Physics behavior is realistic

**Pass Criteria**: Realistic physics behavior

### Test Case 7: Restart Functionality
**Objective**: Test restart system

**Steps**:
1. Build a tower that falls
2. Verify restart button appears
3. Click restart button
4. Verify scene resets

**Expected Results**:
- [ ] Restart button appears on tower fall
- [ ] Clicking restart resets scene
- [ ] All cubes removed
- [ ] Camera returns to initial position
- [ ] Platform remains in place
- [ ] No artifacts from previous game

**Pass Criteria**: Clean restart functionality

### Test Case 8: Performance Testing
**Objective**: Verify performance under load

**Steps**:
1. Place maximum number of cubes (5)
2. Monitor framerate
3. Test with rapid placement
4. Test with camera movement

**Expected Results**:
- [ ] Maintains 60fps with 5 cubes
- [ ] No performance degradation
- [ ] Smooth camera movement
- [ ] Responsive placement system
- [ ] No memory leaks

**Pass Criteria**: Stable 60fps performance

## Physics Validation Tests

### Test Case 9: Weight Physics
**Objective**: Verify weight affects physics behavior

**Steps**:
1. Create two towers side by side
2. Tower A: Weight 1 cubes only
3. Tower B: Weight 5 cubes only
4. Compare stability and behavior

**Expected Results**:
- [ ] Weight 5 cubes fall faster
- [ ] Weight 5 cubes create more impact
- [ ] Weight differences affect stability
- [ ] Physics calculations are accurate

**Pass Criteria**: Weight affects physics realistically

### Test Case 10: Collision Detection
**Objective**: Test collision between cubes

**Steps**:
1. Place cube on platform
2. Drop another cube from above
3. Verify collision and stacking
4. Test edge cases (corners, sides)

**Expected Results**:
- [ ] Cubes collide realistically
- [ ] Stacking works correctly
- [ ] No penetration through objects
- [ ] Collision response is natural

**Pass Criteria**: Accurate collision detection

### Test Case 11: Stability Detection
**Objective**: Test tower fall detection

**Steps**:
1. Build unstable tower
2. Verify fall detection triggers
3. Test edge cases (slow fall, partial collapse)
4. Verify detection accuracy

**Expected Results**:
- [ ] Fall detection triggers immediately
- [ ] No false positives
- [ ] No missed falls
- [ ] Detection works for all fall types

**Pass Criteria**: Reliable fall detection

## Browser Compatibility Tests

### Test Case 12: Chrome Compatibility
**Objective**: Test in Chrome browser

**Steps**:
1. Open game in Chrome (latest version)
2. Run all core test cases
3. Check for Chrome-specific issues

**Expected Results**:
- [ ] All features work correctly
- [ ] Performance is optimal
- [ ] No Chrome-specific errors
- [ ] WebGL support works

**Pass Criteria**: Full functionality in Chrome

### Test Case 13: Firefox Compatibility
**Objective**: Test in Firefox browser

**Steps**:
1. Open game in Firefox (latest version)
2. Run all core test cases
3. Check for Firefox-specific issues

**Expected Results**:
- [ ] All features work correctly
- [ ] Performance is acceptable
- [ ] No Firefox-specific errors
- [ ] WebGL support works

**Pass Criteria**: Full functionality in Firefox

### Test Case 14: Safari Compatibility
**Objective**: Test in Safari browser

**Steps**:
1. Open game in Safari (latest version)
2. Run all core test cases
3. Check for Safari-specific issues

**Expected Results**:
- [ ] All features work correctly
- [ ] Performance is acceptable
- [ ] No Safari-specific errors
- [ ] WebGL support works

**Pass Criteria**: Full functionality in Safari

## Performance Benchmarks

### Benchmark 1: Frame Rate
**Target**: 60fps minimum
**Test Method**: Browser dev tools performance tab
**Acceptance Criteria**: 
- [ ] 60fps with 5 cubes
- [ ] 60fps during camera movement
- [ ] 60fps during cube placement
- [ ] No frame drops below 50fps

### Benchmark 2: Memory Usage
**Target**: < 100MB memory usage
**Test Method**: Browser dev tools memory tab
**Acceptance Criteria**:
- [ ] Initial load < 50MB
- [ ] With 5 cubes < 100MB
- [ ] No memory leaks over time
- [ ] Memory usage stable

### Benchmark 3: Load Time
**Target**: < 3 seconds initial load
**Test Method**: Browser dev tools network tab
**Acceptance Criteria**:
- [ ] Initial load < 3 seconds
- [ ] All assets load correctly
- [ ] No failed requests
- [ ] Progressive loading works

## Bug Reporting Template

### Bug Report Format
```
**Bug Title**: Brief description of the issue

**Environment**:
- Browser: [Chrome/Firefox/Safari] [Version]
- OS: [Windows/Mac/Linux] [Version]
- Resolution: [e.g., 1920x1080]
- Hardware: [CPU, RAM, Graphics]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots/Video**:
[If applicable]

**Console Errors**:
[Any error messages from browser console]

**Severity**:
[Critical/High/Medium/Low]

**Priority**:
[P1/P2/P3/P4]
```

### Severity Levels
- **Critical**: Game-breaking, cannot continue
- **High**: Major functionality affected
- **Medium**: Minor functionality affected
- **Low**: Cosmetic or minor issues

### Priority Levels
- **P1**: Fix immediately
- **P2**: Fix in current sprint
- **P3**: Fix in next sprint
- **P4**: Fix when time permits

## Test Checklist Before Each Milestone

### Pre-Release Checklist
- [ ] All manual test cases pass
- [ ] Performance benchmarks met
- [ ] Browser compatibility verified
- [ ] No critical bugs outstanding
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Build process working
- [ ] Version tagged correctly

### Daily Testing Checklist
- [ ] Core functionality works
- [ ] No new regressions
- [ ] Performance stable
- [ ] No console errors
- [ ] Camera controls responsive
- [ ] Physics behavior realistic

## Automated Testing (Future)

### Unit Tests
- Cube creation functions
- Physics calculations
- Camera control logic
- Placement validation

### Integration Tests
- Physics-rendering synchronization
- Camera-scene interaction
- Placement-physics integration

### End-to-End Tests
- Complete gameplay flow
- Restart functionality
- Performance under load

## Testing Tools

### Development Tools
- **Browser Dev Tools**: Performance, memory, console
- **Three.js Inspector**: Scene debugging
- **Cannon-es Debugger**: Physics visualization

### Testing Frameworks (Future)
- **Jest**: Unit testing
- **Cypress**: End-to-end testing
- **Lighthouse**: Performance auditing

## Test Data Management

### Test Scenarios
- **Basic stacking**: 2-3 cubes
- **Complex towers**: 5+ cubes
- **Edge cases**: Corner placement, rapid clicking
- **Stress tests**: Maximum cubes, rapid camera movement

### Test Results Tracking
- **Test execution log**: Date, tester, results
- **Bug tracking**: Issue numbers, status, resolution
- **Performance metrics**: FPS, memory, load time
- **Regression tracking**: Previous vs. current results

## Quality Gates

### Definition of Done
- [ ] All test cases pass
- [ ] Performance benchmarks met
- [ ] No critical bugs
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] User acceptance testing complete

### Release Criteria
- [ ] 95% test case pass rate
- [ ] Performance within 10% of targets
- [ ] Zero critical bugs
- [ ] All major browsers supported
- [ ] User feedback positive
