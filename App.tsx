import { ClerkProvider } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Platform, ScrollView, Animated, Dimensions, Pressable, useWindowDimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useSignIn, useSignUp, useAuth } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const Stack = createStackNavigator();

const NAVBAR_HEIGHT = 72;

const MIDNIGHT = '#0a1026';
const NAVY = '#142042';
const ACCENT = '#3b82f6';
const LIGHT = '#e0e7ef';
const SUBTLE = '#a1a1aa';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
const isSmall = windowWidth < 600;
const heroTitleSize = isSmall ? 32 : 48;
const heroSubtitleSize = isSmall ? 16 : 20;

const HomeScreen = ({ navigation }: any) => {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  // For smooth scroll on web
  const scrollViewRef = React.useRef<any>(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // For web: ensure body/root can scroll
    if (Platform.OS === 'web') {
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
    }
  }, []);

  const scrollToSection = (yOffset: number) => {
    console.log('Scrolling to:', yOffset);
    if (Platform.OS === 'web') {
      // Use native web scrolling
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    } else if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  const scrollToTop = () => scrollToSection(0);
  const scrollToFeatures = () => scrollToSection(500);
  const scrollToHow = () => scrollToSection(1200);

  // Web version with native scrolling
  if (Platform.OS === 'web') {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: MIDNIGHT,
      }}>
        {/* Scrollable Content for Web */}
        <View style={{ 
          paddingTop: NAVBAR_HEIGHT,
          paddingBottom: 20,
        }}>
          {/* Hero Section */}
          <AnimatedLinearGradient
            colors={[MIDNIGHT, NAVY, MIDNIGHT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              minHeight: 500,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60,
              paddingHorizontal: 24,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>
            <Animated.Text style={{ 
              fontSize: heroTitleSize, 
              fontWeight: 'bold', 
              color: LIGHT, 
              letterSpacing: 1, 
              textAlign: 'center', 
              marginBottom: 24, 
              lineHeight: 56,
              fontFamily: 'Inter_700Bold',
              transform: [{ scale: scaleAnim }],
            }}>
              TalonAI: Your AI-Powered{'\n'}Car Modification Expert
            </Animated.Text>
            <Animated.Text style={{ 
              fontSize: heroSubtitleSize, 
              color: SUBTLE, 
              textAlign: 'center', 
              marginBottom: 40, 
              maxWidth: 700,
              lineHeight: 28,
              fontFamily: 'Inter_400Regular',
              opacity: fadeAnim,
            }}>
              Transform your vehicle with the help of intelligent AI that understands your car, your goals, and your budget. TalonAI is your personal automotive expert, providing customized recommendations for engine builds, performance upgrades, and problem diagnosis.
            </Animated.Text>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={{ 
                  backgroundColor: ACCENT, 
                  paddingVertical: 18, 
                  paddingHorizontal: 48, 
                  borderRadius: 16, 
                  shadowColor: ACCENT, 
                  shadowOpacity: 0.4, 
                  shadowRadius: 12,
                  elevation: 6,
                }}
                onPress={scrollToFeatures}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1, fontFamily: 'Inter_600SemiBold' }}>Get Started</Text>
              </TouchableOpacity>
            </Animated.View>
          </AnimatedLinearGradient>

          {/* Features Section */}
          <AnimatedSection scrollY={scrollY} index={1}>
          <View style={{ paddingVertical: 60, paddingHorizontal: 16, alignItems: 'center', backgroundColor: NAVY }}>
            <Animated.Text style={{ 
              color: LIGHT, 
              fontSize: isSmall ? 28 : 40, 
              fontWeight: 'bold', 
              marginBottom: 48, 
              textAlign: 'center',
              opacity: fadeAnim,
              fontFamily: 'Inter_700Bold',
            }}>
              TalonAI Features
            </Animated.Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 24, maxWidth: 1200 }}>
              <AnimatedFeatureCard
                icon="🤖"
                title="AI-Powered Car Modifications Assistant"
                descList={[
                  'Intelligent Mod Recommendations: Personalized suggestions for your car and goals',
                  'Build Planning: Engine build plans with cost estimates and timelines',
                  'Symptom Diagnosis: AI-powered car problem diagnosis and repair',
                  'Performance Optimization: Advice on horsepower, reliability, aesthetics',
                ]}
                delay={0}
              />
              <AnimatedFeatureCard
                icon="🚗"
                title="Comprehensive Car Profile Management"
                descList={[
                  'Vehicle Database: Store make, model, year, resale preferences',
                  'Mod Tracking: Track installed/planned mods, brands, costs, dates',
                  'Symptom Logging: Record issues, severity, and resolutions',
                  'Build Goals: Set and prioritize performance, reliability, or aesthetic goals',
                ]}
                delay={200}
              />
              <AnimatedFeatureCard
                icon="💬"
                title="Conversational AI Experience"
                descList={[
                  'Context-Aware Chat: AI remembers your car and conversations',
                  'Session Management: Seamless conversation flow',
                  'Multi-Agent System: Specialized AI agents for car tasks',
                  'Memory System: Stores conversation and car profile history',
                ]}
                delay={400}
              />
              <AnimatedFeatureCard
                icon="🔧"
                title="Expert Knowledge Base"
                descList={[
                  'Mod Recommendations: Intakes, turbos, exhausts, suspension, and more',
                  'Cost Estimation: Realistic pricing for parts and install',
                  'Brand Recommendations: Trusted brands and products',
                  'Installation Guidance: Step-by-step mod installation advice',
                ]}
                delay={600}
              />
              <AnimatedFeatureCard
                icon="📊"
                title="Smart Analytics"
                descList={[
                  'Build Progress Tracking: Monitor your mod journey',
                  'Cost Analysis: Track total investment',
                  'Performance Metrics: Measure horsepower gains',
                  'Maintenance Logging: Record service history and costs',
                ]}
                delay={800}
              />
            </View>
          </View>
          </AnimatedSection>

          {/* How It Works Section */}
          <AnimatedSection scrollY={scrollY} index={2}>
          <View style={{ paddingVertical: 60, paddingHorizontal: 24, alignItems: 'center', backgroundColor: MIDNIGHT }}>
            <Text style={{ color: LIGHT, fontSize: 36, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' }}>How It Works</Text>
            <View style={{ maxWidth: 800, width: '100%' }}>
              <AnimatedHowStep icon="1️⃣" title="Tell us about your car" desc="Enter your vehicle details and preferences" delay={0} />
              <AnimatedHowStep icon="2️⃣" title="Describe your goals" desc="Whether it's horsepower, reliability, or aesthetics" delay={200} />
              <AnimatedHowStep icon="3️⃣" title="Get expert advice" desc="Receive personalized recommendations from our AI automotive expert" delay={400} />
              <AnimatedHowStep icon="4️⃣" title="Track your progress" desc="Monitor your build journey and maintain detailed records" delay={600} />
            </View>
          </View>
          </AnimatedSection>

          {/* Perfect For Section */}
          <AnimatedSection scrollY={scrollY} index={3}>
          <View style={{ paddingVertical: 50, alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 24 }}>
            <Text style={{ color: LIGHT, fontSize: isSmall ? 24 : 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' }}>Perfect For</Text>
            <View style={{ maxWidth: 700, width: '100%' }}>
              <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• Performance Enthusiasts looking to maximize their car's potential</Text>
              <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• DIY Mechanics seeking expert guidance on modifications</Text>
              <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• Car Owners with performance issues needing diagnosis</Text>
              <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• Build Planners wanting comprehensive project management</Text>
            </View>
          </View>
          </AnimatedSection>

          {/* Security Note */}
          <View style={{ paddingVertical: 40, alignItems: 'center', backgroundColor: MIDNIGHT, paddingHorizontal: 24 }}>
            <Text style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>🔒 Secure & Private</Text>
            <Text style={{ color: LIGHT, fontSize: 18, textAlign: 'center', maxWidth: 600, lineHeight: 24 }}>
              Your car data and conversations are protected with enterprise-grade security and user authentication.
            </Text>
          </View>

          {/* Footer */}
          <View style={{ alignItems: 'center', paddingVertical: 40, backgroundColor: NAVY, paddingHorizontal: 24 }}>
            <Text style={{ color: SUBTLE, fontSize: 16, textAlign: 'center', maxWidth: 700, lineHeight: 24, marginBottom: 16 }}>
              Start your automotive journey today - Whether you're planning your first mod or building a complete engine, TalonAI has the expertise to guide you every step of the way.
            </Text>
            <Text style={{ color: SUBTLE, fontSize: 16, textAlign: 'center', maxWidth: 700, lineHeight: 24, marginBottom: 24 }}>
              Powered by advanced AI agents specialized in automotive knowledge, TalonAI combines cutting-edge technology with deep automotive expertise to deliver the most intelligent car modification assistant available.
            </Text>
            <Text style={{ color: SUBTLE, fontSize: 14 }}>© {new Date().getFullYear()} TalonAI. All rights reserved.</Text>
          </View>
        </View>

        {/* Fixed Navbar */}
        <View style={{
          height: NAVBAR_HEIGHT,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 32,
          backgroundColor: `${NAVY}aa`,
          borderBottomWidth: 1,
          borderColor: ACCENT,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: '100%',
          shadowColor: ACCENT,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
          {/* Logo */}
          <Animated.View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            transform: [{ scale: scaleAnim }],
          }}>
            <Image
              source={require('./assets/logo.png')}
              style={{ width: 44, height: 44, borderRadius: 12, marginRight: 12, backgroundColor: '#fff' }}
              resizeMode="contain"
            />
            <Text style={{ color: LIGHT, fontWeight: 'bold', fontSize: 22, letterSpacing: 1, fontFamily: 'Inter_700Bold' }}>TalonAI</Text>
          </Animated.View>
          {/* Nav links */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            <TouchableOpacity onPress={scrollToTop}>
              <Text style={{ color: LIGHT, fontSize: 16, fontWeight: '500', marginHorizontal: 12 }}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={scrollToFeatures}>
              <Text style={{ color: LIGHT, fontSize: 16, fontWeight: '500', marginHorizontal: 12 }}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={scrollToHow}>
              <Text style={{ color: LIGHT, fontSize: 16, fontWeight: '500', marginHorizontal: 12 }}>How It Works</Text>
            </TouchableOpacity>
          </View>
          {/* Auth buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              style={{ paddingVertical: 8, paddingHorizontal: 24, borderRadius: 12, backgroundColor: 'transparent', borderWidth: 1, borderColor: ACCENT }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={{ color: ACCENT, fontWeight: 'bold', fontSize: 16 }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingVertical: 8, paddingHorizontal: 24, borderRadius: 12, backgroundColor: ACCENT }}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Native version with ScrollView
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: MIDNIGHT,
    }}>
      {/* Scrollable Content */}
      <Animated.ScrollView 
        ref={scrollViewRef}
        style={{ 
          flex: 1,
        }}
        contentContainerStyle={{ 
          paddingTop: NAVBAR_HEIGHT,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      >
        {/* Hero Section */}
        <AnimatedLinearGradient
          colors={[MIDNIGHT, NAVY, MIDNIGHT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            minHeight: 500,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 24,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <Animated.Text style={{ 
            fontSize: heroTitleSize, 
            fontWeight: 'bold', 
            color: LIGHT, 
            letterSpacing: 1, 
            textAlign: 'center', 
            marginBottom: 24, 
            lineHeight: 56,
            fontFamily: 'Inter_700Bold',
            transform: [{ scale: scaleAnim }],
          }}>
            TalonAI: Your AI-Powered{'\n'}Car Modification Expert
          </Animated.Text>
          <Animated.Text style={{ 
            fontSize: heroSubtitleSize, 
            color: SUBTLE, 
            textAlign: 'center', 
            marginBottom: 40, 
            maxWidth: 700,
            lineHeight: 28,
            fontFamily: 'Inter_400Regular',
            opacity: fadeAnim,
          }}>
            Transform your vehicle with the help of intelligent AI that understands your car, your goals, and your budget. TalonAI is your personal automotive expert, providing customized recommendations for engine builds, performance upgrades, and problem diagnosis.
          </Animated.Text>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={{ 
                backgroundColor: ACCENT, 
                paddingVertical: 18, 
                paddingHorizontal: 48, 
                borderRadius: 16, 
                shadowColor: ACCENT, 
                shadowOpacity: 0.4, 
                shadowRadius: 12,
                elevation: 6,
              }}
              onPress={scrollToFeatures}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1, fontFamily: 'Inter_600SemiBold' }}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </AnimatedLinearGradient>

        {/* Features Section */}
        <AnimatedSection scrollY={scrollY} index={1}>
        <View style={{ paddingVertical: 60, paddingHorizontal: 16, alignItems: 'center', backgroundColor: NAVY }}>
          <Animated.Text style={{ 
            color: LIGHT, 
            fontSize: isSmall ? 28 : 40, 
            fontWeight: 'bold', 
            marginBottom: 48, 
            textAlign: 'center',
            opacity: fadeAnim,
            fontFamily: 'Inter_700Bold',
          }}>
            TalonAI Features
          </Animated.Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 24, maxWidth: 1200 }}>
            <AnimatedFeatureCard
              icon="🤖"
              title="AI-Powered Car Modifications Assistant"
              descList={[
                'Intelligent Mod Recommendations: Personalized suggestions for your car and goals',
                'Build Planning: Engine build plans with cost estimates and timelines',
                'Symptom Diagnosis: AI-powered car problem diagnosis and repair',
                'Performance Optimization: Advice on horsepower, reliability, aesthetics',
              ]}
              delay={0}
            />
            <AnimatedFeatureCard
              icon="🚗"
              title="Comprehensive Car Profile Management"
              descList={[
                'Vehicle Database: Store make, model, year, resale preferences',
                'Mod Tracking: Track installed/planned mods, brands, costs, dates',
                'Symptom Logging: Record issues, severity, and resolutions',
                'Build Goals: Set and prioritize performance, reliability, or aesthetic goals',
              ]}
              delay={200}
            />
            <AnimatedFeatureCard
              icon="💬"
              title="Conversational AI Experience"
              descList={[
                'Context-Aware Chat: AI remembers your car and conversations',
                'Session Management: Seamless conversation flow',
                'Multi-Agent System: Specialized AI agents for car tasks',
                'Memory System: Stores conversation and car profile history',
              ]}
              delay={400}
            />
            <AnimatedFeatureCard
              icon="🔧"
              title="Expert Knowledge Base"
              descList={[
                'Mod Recommendations: Intakes, turbos, exhausts, suspension, and more',
                'Cost Estimation: Realistic pricing for parts and install',
                'Brand Recommendations: Trusted brands and products',
                'Installation Guidance: Step-by-step mod installation advice',
              ]}
              delay={600}
            />
            <AnimatedFeatureCard
              icon="📊"
              title="Smart Analytics"
              descList={[
                'Build Progress Tracking: Monitor your mod journey',
                'Cost Analysis: Track total investment',
                'Performance Metrics: Measure horsepower gains',
                'Maintenance Logging: Record service history and costs',
              ]}
              delay={800}
            />
          </View>
        </View>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection scrollY={scrollY} index={2}>
        <View style={{ paddingVertical: 60, paddingHorizontal: 24, alignItems: 'center', backgroundColor: MIDNIGHT }}>
          <Text style={{ color: LIGHT, fontSize: 36, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' }}>How It Works</Text>
          <View style={{ maxWidth: 800, width: '100%' }}>
            <AnimatedHowStep icon="1️⃣" title="Tell us about your car" desc="Enter your vehicle details and preferences" delay={0} />
            <AnimatedHowStep icon="2️⃣" title="Describe your goals" desc="Whether it's horsepower, reliability, or aesthetics" delay={200} />
            <AnimatedHowStep icon="3️⃣" title="Get expert advice" desc="Receive personalized recommendations from our AI automotive expert" delay={400} />
            <AnimatedHowStep icon="4️⃣" title="Track your progress" desc="Monitor your build journey and maintain detailed records" delay={600} />
          </View>
        </View>
        </AnimatedSection>

        {/* Perfect For Section */}
        <AnimatedSection scrollY={scrollY} index={3}>
        <View style={{ paddingVertical: 50, alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 24 }}>
          <Text style={{ color: LIGHT, fontSize: isSmall ? 24 : 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' }}>Perfect For</Text>
          <View style={{ maxWidth: 700, width: '100%' }}>
            <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• Performance Enthusiasts looking to maximize their car's potential</Text>
            <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• DIY Mechanics seeking expert guidance on modifications</Text>
            <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• Car Owners with performance issues needing diagnosis</Text>
            <Text style={{ color: LIGHT, fontSize: 18, marginBottom: 12, lineHeight: 24 }}>• Build Planners wanting comprehensive project management</Text>
          </View>
        </View>
        </AnimatedSection>

        {/* Security Note */}
        <View style={{ paddingVertical: 40, alignItems: 'center', backgroundColor: MIDNIGHT, paddingHorizontal: 24 }}>
          <Text style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>🔒 Secure & Private</Text>
          <Text style={{ color: LIGHT, fontSize: 18, textAlign: 'center', maxWidth: 600, lineHeight: 24 }}>
            Your car data and conversations are protected with enterprise-grade security and user authentication.
          </Text>
        </View>

        {/* Footer */}
        <View style={{ alignItems: 'center', paddingVertical: 40, backgroundColor: NAVY, paddingHorizontal: 24 }}>
          <Text style={{ color: SUBTLE, fontSize: 16, textAlign: 'center', maxWidth: 700, lineHeight: 24, marginBottom: 16 }}>
            Start your automotive journey today - Whether you're planning your first mod or building a complete engine, TalonAI has the expertise to guide you every step of the way.
          </Text>
          <Text style={{ color: SUBTLE, fontSize: 16, textAlign: 'center', maxWidth: 700, lineHeight: 24, marginBottom: 24 }}>
            Powered by advanced AI agents specialized in automotive knowledge, TalonAI combines cutting-edge technology with deep automotive expertise to deliver the most intelligent car modification assistant available.
          </Text>
          <Text style={{ color: SUBTLE, fontSize: 14 }}>© {new Date().getFullYear()} TalonAI. All rights reserved.</Text>
        </View>
      </Animated.ScrollView>

      {/* Fixed Navbar */}
      <View style={{
        height: NAVBAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        backgroundColor: `${NAVY}aa`,
        borderBottomWidth: 1,
        borderColor: ACCENT,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        shadowColor: ACCENT,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}>
        {/* Logo */}
        <Animated.View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          transform: [{ scale: scaleAnim }],
        }}>
          <Image
            source={require('./assets/logo.png')}
            style={{ width: 44, height: 44, borderRadius: 12, marginRight: 12, backgroundColor: '#fff' }}
            resizeMode="contain"
          />
          <Text style={{ color: LIGHT, fontWeight: 'bold', fontSize: 22, letterSpacing: 1, fontFamily: 'Inter_700Bold' }}>TalonAI</Text>
        </Animated.View>
        {/* Nav links */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
          <TouchableOpacity onPress={scrollToTop}>
            <Text style={{ color: LIGHT, fontSize: 16, fontWeight: '500', marginHorizontal: 12 }}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={scrollToFeatures}>
            <Text style={{ color: LIGHT, fontSize: 16, fontWeight: '500', marginHorizontal: 12 }}>Features</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={scrollToHow}>
            <Text style={{ color: LIGHT, fontSize: 16, fontWeight: '500', marginHorizontal: 12 }}>How It Works</Text>
          </TouchableOpacity>
        </View>
        {/* Auth buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            style={{ paddingVertical: 8, paddingHorizontal: 24, borderRadius: 12, backgroundColor: 'transparent', borderWidth: 1, borderColor: ACCENT }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={{ color: ACCENT, fontWeight: 'bold', fontSize: 16 }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingVertical: 8, paddingHorizontal: 24, borderRadius: 12, backgroundColor: ACCENT }}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Animated FeatureCard component
const AnimatedFeatureCard = ({ icon, title, descList, delay }: { icon: string; title: string; descList: string[]; delay: number }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleHoverIn = () => {
    Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true, friction: 5 }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  };

  React.useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  const interactiveProps = Platform.OS === 'web' ? { onMouseEnter: handleHoverIn, onMouseLeave: handleHoverOut } : { onPressIn: handleHoverIn, onPressOut: handleHoverOut };

  return (
    <Pressable {...interactiveProps}>
      <Animated.View style={{ 
        width: windowWidth > 700 ? 320 : windowWidth - 48, 
        backgroundColor: MIDNIGHT, 
        borderRadius: 20, 
        padding: 32, 
        alignItems: 'flex-start', 
        margin: 12, 
        shadowColor: ACCENT, 
        shadowOpacity: 0.15, 
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.1)',
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>{icon}</Text>
        <Text style={{ color: LIGHT, fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 16, lineHeight: 28 }}>{title}</Text>
        {descList.map((desc, i) => (
          <Text key={i} style={{ color: SUBTLE, fontSize: 16, fontFamily: 'Inter_400Regular', marginBottom: 8, lineHeight: 22 }}>• {desc}</Text>
        ))}
      </Animated.View>
    </Pressable>
  );
};

// Animated HowStep component
const AnimatedHowStep = ({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  return (
    <Animated.View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 32,
      padding: 24,
      backgroundColor: NAVY,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.2)',
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    }}>
      <Text style={{ fontSize: 32, marginRight: 24 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: LIGHT, fontSize: 22, fontWeight: 'bold', marginBottom: 8, lineHeight: 28 }}>{title}</Text>
        <Text style={{ color: SUBTLE, fontSize: 16, lineHeight: 22 }}>{desc}</Text>
      </View>
    </Animated.View>
  );
};

// Generic section wrapper that fades/slides in based on scroll position
const AnimatedSection = ({ scrollY, index, children }: { scrollY: Animated.Value; index: number; children: React.ReactNode }) => {
  const { height } = Dimensions.get('window');
  const inputRange = [height * (index - 0.2), height * index, height * (index + 0.5)];
  const opacity = scrollY.interpolate({ inputRange, outputRange: [0, 1, 1], extrapolate: 'clamp' });
  const translateY = scrollY.interpolate({ inputRange, outputRange: [40, 0, 0], extrapolate: 'clamp' });
  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

const LoginScreen = ({ navigation }: any) => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (!isLoaded) return;
      const result = await signIn.create({ identifier: email, password } as any);
      await setActive({ session: result.createdSessionId });
      navigation.replace('Chat');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: MIDNIGHT }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Text style={{ color: ACCENT, fontSize: 18, fontWeight: '500' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: LIGHT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>Welcome Back</Text>
        <Text style={{ color: SUBTLE, fontSize: 18 }}>Sign in to your TalonAI account</Text>
      </View>

      {/* Form Container */}
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ 
          backgroundColor: NAVY, 
          borderRadius: 20, 
          padding: 32, 
          shadowColor: ACCENT, 
          shadowOpacity: 0.1, 
          shadowRadius: 20,
          elevation: 8,
        }}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={SUBTLE}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ 
              backgroundColor: MIDNIGHT, 
              color: LIGHT, 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 16, 
              borderWidth: 1, 
              borderColor: 'rgba(59, 130, 246, 0.2)',
              fontSize: 16,
            }}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={SUBTLE}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ 
              backgroundColor: MIDNIGHT, 
              color: LIGHT, 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 20, 
              borderWidth: 1, 
              borderColor: 'rgba(59, 130, 246, 0.2)',
              fontSize: 16,
            }}
          />
          
          {error ? (
            <View style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: 8, 
              padding: 12, 
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}>
              <Text style={{ color: '#ef4444', textAlign: 'center', fontSize: 16 }}>{error}</Text>
            </View>
          ) : null}
          
          <TouchableOpacity
            style={{ 
              backgroundColor: loading ? SUBTLE : ACCENT, 
              padding: 18, 
              borderRadius: 12, 
              alignItems: 'center', 
              marginBottom: 16,
              shadowColor: ACCENT,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.replace('SignUp')} 
            style={{ alignItems: 'center', marginTop: 8 }}
          >
            <Text style={{ color: SUBTLE, fontSize: 16 }}>
              Don't have an account? <Text style={{ color: ACCENT, fontWeight: '600' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const SignUpScreen = ({ navigation }: any) => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      if (!isLoaded) return;
      await signUp.create({ emailAddress: email, password } as any);
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      if (!isLoaded) return;
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
      navigation.replace('Chat');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: MIDNIGHT }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Text style={{ color: ACCENT, fontSize: 18, fontWeight: '500' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: LIGHT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
          {pendingVerification ? 'Verify Email' : 'Create Account'}
        </Text>
        <Text style={{ color: SUBTLE, fontSize: 18 }}>
          {pendingVerification ? 'Enter the code sent to your email' : 'Join TalonAI and start modifying your car'}
        </Text>
      </View>

      {/* Form Container */}
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ 
          backgroundColor: NAVY, 
          borderRadius: 20, 
          padding: 32, 
          shadowColor: ACCENT, 
          shadowOpacity: 0.1, 
          shadowRadius: 20,
          elevation: 8,
        }}>
          {!pendingVerification ? (
            <>
              <TextInput
                placeholder="Email"
                placeholderTextColor={SUBTLE}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ 
                  backgroundColor: MIDNIGHT, 
                  color: LIGHT, 
                  borderRadius: 12, 
                  padding: 16, 
                  marginBottom: 16, 
                  borderWidth: 1, 
                  borderColor: 'rgba(59, 130, 246, 0.2)',
                  fontSize: 16,
                }}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={SUBTLE}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ 
                  backgroundColor: MIDNIGHT, 
                  color: LIGHT, 
                  borderRadius: 12, 
                  padding: 16, 
                  marginBottom: 20, 
                  borderWidth: 1, 
                  borderColor: 'rgba(59, 130, 246, 0.2)',
                  fontSize: 16,
                }}
              />
              
              {error ? (
                <View style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: 8, 
                  padding: 12, 
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}>
                  <Text style={{ color: '#ef4444', textAlign: 'center', fontSize: 16 }}>{error}</Text>
                </View>
              ) : null}
              
              <TouchableOpacity
                style={{ 
                  backgroundColor: loading ? SUBTLE : ACCENT, 
                  padding: 18, 
                  borderRadius: 12, 
                  alignItems: 'center', 
                  marginBottom: 16,
                  shadowColor: ACCENT,
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => navigation.replace('Login')} 
                style={{ alignItems: 'center', marginTop: 8 }}
              >
                <Text style={{ color: SUBTLE, fontSize: 16 }}>
                  Already have an account? <Text style={{ color: ACCENT, fontWeight: '600' }}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                placeholder="Verification Code"
                placeholderTextColor={SUBTLE}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={{ 
                  backgroundColor: MIDNIGHT, 
                  color: LIGHT, 
                  borderRadius: 12, 
                  padding: 16, 
                  marginBottom: 20, 
                  borderWidth: 1, 
                  borderColor: 'rgba(59, 130, 246, 0.2)',
                  fontSize: 16,
                  textAlign: 'center',
                  letterSpacing: 2,
                }}
              />
              
              {error ? (
                <View style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: 8, 
                  padding: 12, 
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}>
                  <Text style={{ color: '#ef4444', textAlign: 'center', fontSize: 16 }}>{error}</Text>
                </View>
              ) : null}
              
              <TouchableOpacity
                style={{ 
                  backgroundColor: loading ? SUBTLE : ACCENT, 
                  padding: 18, 
                  borderRadius: 12, 
                  alignItems: 'center', 
                  marginBottom: 16,
                  shadowColor: ACCENT,
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={handleVerify}
                disabled={loading}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const ChatScreen = () => {
  const { userId, isSignedIn } = useAuth();
  const [sessionId, setSessionId] = React.useState(generateSessionId());
  const [messages, setMessages] = React.useState<{ sender: 'user' | 'agent'; text: string }[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setLoading(true);
    setError('');
    const userMessage = input;
    setInput('');
    try {
      const response = await fetch('https://talonaibackend.onrender.com/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://talonai.us',
          'User-Agent': 'TalonAIFrontend/1.0',
        },
        body: JSON.stringify({
          query: userMessage,
          user_id: userId,
          session_id: sessionId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'agent', text: data.message }]);
    } catch (err: any) {
      setError(err.message || 'Error sending message');
      setMessages((prev) => [...prev, { sender: 'agent', text: 'Sorry, there was an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setSessionId(generateSessionId());
    setMessages([]);
    setError('');
  };

  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: '#18181b', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 20 }}>Please log in to chat with TalonAI.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#18181b', paddingTop: 60 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>TalonAI Chat</Text>
        <TouchableOpacity onPress={startNewConversation} style={{ backgroundColor: '#e11d48', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>New Conversation</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 16, marginBottom: 8 }}>
        {messages.length === 0 && (
          <Text style={{ color: '#a1a1aa', textAlign: 'center', marginTop: 40 }}>
            Start chatting about your car mods, builds, or issues!
          </Text>
        )}
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#e11d48' : '#23232b',
              borderRadius: 16,
              marginVertical: 4,
              padding: 12,
              maxWidth: '80%',
              shadowColor: msg.sender === 'user' ? '#e11d48' : '#23232b',
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Text style={{ color: msg.sender === 'user' ? '#fff' : '#e11d48', fontSize: 16 }}>{msg.text}</Text>
          </View>
        ))}
        {loading && (
          <View style={{ alignSelf: 'flex-start', backgroundColor: '#23232b', borderRadius: 16, marginVertical: 4, padding: 12, maxWidth: '80%' }}>
            <Text style={{ color: '#e11d48', fontSize: 16 }}>TalonAI is thinking...</Text>
          </View>
        )}
      </View>
      {error ? (
        <Text style={{ color: '#e11d48', textAlign: 'center', marginBottom: 8 }}>{error}</Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#18181b', borderTopWidth: 1, borderColor: '#23232b' }}>
        <TextInput
          style={{ flex: 1, backgroundColor: '#23232b', color: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#27272a', marginRight: 8 }}
          placeholder="Type your message..."
          placeholderTextColor="#a1a1aa"
          value={input}
          onChangeText={setInput}
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading || !input.trim()}
          style={{ backgroundColor: loading || !input.trim() ? '#a1a1aa' : '#e11d48', padding: 14, borderRadius: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// TODO: For production, use a secure environment variable solution for the Clerk key
const CLERK_PUBLISHABLE_KEY = 'pk_test_dml0YWwtb3Jpb2xlLTI5LmNsZXJrLmFjY291bnRzLmRldiQ';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Apply global font defaults
  (Text as any).defaultProps = {
    ...(Text as any).defaultProps,
    style: { fontFamily: 'Inter_400Regular', color: LIGHT },
  };

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Remove default header
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </ClerkProvider>
  );
}
