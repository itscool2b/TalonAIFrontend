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

const NAVBAR_HEIGHT = 80;

// Huly.io inspired colors
const WHITE = '#ffffff';
const LIGHT_GRAY = '#f8fafc';
const GRAY = '#64748b';
const DARK_GRAY = '#334155';
const BLACK = '#0f172a';
const BLUE = '#3b82f6';
const DARK_BLUE = '#1e40af';

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// Responsive helper functions
const getBreakpoint = (width: number) => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  if (width < BREAKPOINTS.desktop) return 'desktop';
  return 'wide';
};

const getResponsiveValue = (width: number, values: { mobile: any; tablet?: any; desktop?: any; wide?: any }) => {
  const breakpoint = getBreakpoint(width);
  return values[breakpoint] || values.desktop || values.tablet || values.mobile;
};

const getResponsiveFontSize = (width: number, baseSize: number) => {
  const multiplier = getResponsiveValue(width, {
    mobile: 0.8,
    tablet: 0.9,
    desktop: 1,
    wide: 1.1,
  });
  return baseSize * multiplier;
};

const getResponsiveSpacing = (width: number, baseSpacing: number) => {
  const multiplier = getResponsiveValue(width, {
    mobile: 0.7,
    tablet: 0.85,
    desktop: 1,
    wide: 1.2,
  });
  return baseSpacing * multiplier;
};

const HomeScreen = ({ navigation }: any) => {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scrollViewRef = React.useRef<any>(null);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    if (Platform.OS === 'web') {
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
    }
  }, []);

  const scrollToSection = (yOffset: number) => {
    if (Platform.OS === 'web') {
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    } else if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  const scrollToFeatures = () => scrollToSection(getResponsiveValue(width, { mobile: 400, tablet: 500, desktop: 600, wide: 700 }));
  const scrollToTechnology = () => scrollToSection(getResponsiveValue(width, { mobile: 1000, tablet: 1200, desktop: 1400, wide: 1600 }));

  // Web version
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: WHITE }}>
        {/* Navigation */}
        <HulyNavbar navigation={navigation} scrollToFeatures={scrollToFeatures} scrollToTechnology={scrollToTechnology} />
        
        {/* Hero Section */}
        <View style={{
          paddingTop: NAVBAR_HEIGHT + getResponsiveSpacing(width, 80),
          paddingBottom: getResponsiveSpacing(width, 120),
          paddingHorizontal: getResponsiveSpacing(width, 24),
          alignItems: 'center',
          backgroundColor: WHITE,
        }}>
          <View style={{ maxWidth: 1200, width: '100%', alignItems: 'center' }}>
            <Animated.Text style={{
              fontSize: getResponsiveValue(width, { mobile: 36, tablet: 48, desktop: 64, wide: 72 }),
              fontWeight: '800',
              color: BLACK,
              textAlign: 'center',
              marginBottom: getResponsiveSpacing(width, 24),
              lineHeight: getResponsiveValue(width, { mobile: 42, tablet: 54, desktop: 70, wide: 78 }),
              fontFamily: 'Inter_700Bold',
              letterSpacing: -1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>
              Everything App for your{'\n'}Car Modifications
            </Animated.Text>
            <Animated.Text style={{
              fontSize: getResponsiveFontSize(width, 22),
              color: GRAY,
              textAlign: 'center',
              marginBottom: getResponsiveSpacing(width, 40),
              maxWidth: getResponsiveValue(width, { mobile: 320, tablet: 500, desktop: 650, wide: 750 }),
              lineHeight: getResponsiveValue(width, { mobile: 28, tablet: 30, desktop: 32, wide: 34 }),
              fontFamily: 'Inter_400Regular',
              fontWeight: '400',
              opacity: fadeAnim,
            }}>
              TalonAI serves as an all-in-one replacement for traditional car modification advice, planning tools, and expert consultation.
            </Animated.Text>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <TouchableOpacity
                style={{
                  backgroundColor: BLUE,
                  paddingVertical: 18,
                  paddingHorizontal: 36,
                  borderRadius: 12,
                  shadowColor: BLUE,
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 8,
                }}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={{
                  color: WHITE,
                  fontWeight: '600',
                  fontSize: 18,
                  fontFamily: 'Inter_600SemiBold',
                  letterSpacing: -0.2,
                }}>
                  Try it Free
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Features Overview */}
        <View style={{
          paddingVertical: 80,
          paddingHorizontal: 24,
          backgroundColor: LIGHT_GRAY,
        }}>
          <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
            <Text style={{
              fontSize: getResponsiveValue(width, { mobile: 28, tablet: 36, desktop: 40, wide: 44 }),
              fontWeight: '700',
              color: BLACK,
              textAlign: 'center',
              marginBottom: getResponsiveSpacing(width, 20),
              fontFamily: 'Inter_700Bold',
              letterSpacing: -0.5,
            }}>
              Everything you need for car modifications:
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
              marginTop: 40,
            }}>
              {['AI Advisor', 'Build Planner', 'Cost Calculator', 'Part Finder', 'Progress Tracker', 'Community Chat'].map((feature, index) => (
                <View key={index} style={{
                  backgroundColor: WHITE,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  shadowColor: BLACK,
                  shadowOpacity: 0.03,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}>
                  <Text style={{
                    color: DARK_GRAY,
                    fontSize: 15,
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                    letterSpacing: -0.1,
                  }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Main Features */}
        <View style={{
          paddingVertical: 100,
          paddingHorizontal: 24,
          backgroundColor: WHITE,
        }}>
          <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
            <Text style={{
              fontSize: getResponsiveValue(width, { mobile: 32, tablet: 44, desktop: 52, wide: 56 }),
              fontWeight: '700',
              color: BLACK,
              textAlign: 'center',
              marginBottom: getResponsiveSpacing(width, 24),
              fontFamily: 'Inter_700Bold',
              letterSpacing: -0.8,
            }}>
              Unmatched productivity
            </Text>
            <Text style={{
              fontSize: 20,
              color: GRAY,
              textAlign: 'center',
              marginBottom: 64,
              maxWidth: 600,
              alignSelf: 'center',
              lineHeight: 30,
              fontFamily: 'Inter_400Regular',
            }}>
              TalonAI is a comprehensive platform that provides amazing collaboration opportunities for car enthusiasts and mechanics alike.
            </Text>
            <View style={{
              flexDirection: getResponsiveValue(width, { mobile: 'column', tablet: 'column', desktop: 'row', wide: 'row' }),
              gap: getResponsiveSpacing(width, 32),
            }}>
              <HulyFeatureCard
                title="AI-Powered Recommendations"
                description="Get personalized mod suggestions based on your car, goals, and budget with our intelligent AI advisor."
                features={[
                  'Smart part recommendations',
                  'Performance predictions',
                  'Budget optimization',
                  'Compatibility checks'
                ]}
              />
              <HulyFeatureCard
                title="Build Planning & Tracking"
                description="Plan your entire build with detailed timelines, cost estimates, and progress tracking."
                features={[
                  'Visual build timeline',
                  'Cost breakdown analysis',
                  'Progress milestones',
                  'Installation guides'
                ]}
              />
              <HulyFeatureCard
                title="Expert Knowledge Base"
                description="Access comprehensive automotive knowledge with real-time updates and expert insights."
                features={[
                  'Technical specifications',
                  'Installation tutorials',
                  'Troubleshooting guides',
                  'Performance data'
                ]}
              />
            </View>
          </View>
        </View>

        {/* Technology Section */}
        <View style={{
          paddingVertical: 100,
          paddingHorizontal: 24,
          backgroundColor: LIGHT_GRAY,
        }}>
          <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
            <Text style={{
              fontSize: getResponsiveValue(width, { mobile: 32, tablet: 44, desktop: 52, wide: 56 }),
              fontWeight: '700',
              color: BLACK,
              textAlign: 'center',
              marginBottom: getResponsiveSpacing(width, 24),
              fontFamily: 'Inter_700Bold',
              letterSpacing: -0.8,
            }}>
              Powered by Advanced Technology
            </Text>
            <Text style={{
              fontSize: 20,
              color: GRAY,
              textAlign: 'center',
              marginBottom: 64,
              maxWidth: 700,
              alignSelf: 'center',
              lineHeight: 30,
              fontFamily: 'Inter_400Regular',
            }}>
              Our cutting-edge AI and machine learning technologies provide the most accurate and personalized car modification recommendations.
            </Text>
            
            <View style={{
              flexDirection: getResponsiveValue(width, { mobile: 'column', tablet: 'column', desktop: 'row', wide: 'row' }),
              gap: getResponsiveSpacing(width, 32),
              marginBottom: getResponsiveSpacing(width, 60),
            }}>
              <TechnologyCard
                icon="🧠"
                title="Machine Learning Engine"
                description="Advanced algorithms that learn from millions of car modifications to provide personalized recommendations."
              />
              <TechnologyCard
                icon="🔗"
                title="Real-time Integration"
                description="Live data feeds from parts suppliers, forums, and automotive databases for up-to-date information."
              />
              <TechnologyCard
                icon="📊"
                title="Predictive Analytics"
                description="Forecast performance gains, costs, and compatibility issues before you make any modifications."
              />
            </View>

            <View style={{
              backgroundColor: WHITE,
              borderRadius: 20,
              padding: 40,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              shadowColor: BLACK,
              shadowOpacity: 0.05,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: BLACK,
                textAlign: 'center',
                marginBottom: 16,
                fontFamily: 'Inter_700Bold',
                letterSpacing: -0.3,
              }}>
                AI-Powered Insights
              </Text>
              <Text style={{
                fontSize: 16,
                color: GRAY,
                textAlign: 'center',
                lineHeight: 26,
                fontFamily: 'Inter_400Regular',
                marginBottom: 24,
              }}>
                Our AI analyzes your specific vehicle, driving habits, and goals to provide recommendations that are perfectly tailored to your needs.
              </Text>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 12,
              }}>
                {['Natural Language Processing', 'Computer Vision', 'Deep Learning', 'Predictive Modeling'].map((tech, index) => (
                  <View key={index} style={{
                    backgroundColor: LIGHT_GRAY,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                  }}>
                    <Text style={{
                      color: DARK_GRAY,
                      fontSize: 14,
                      fontWeight: '500',
                      fontFamily: 'Inter_600SemiBold',
                    }}>
                      {tech}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={{
          paddingVertical: 100,
          paddingHorizontal: 24,
          backgroundColor: WHITE,
          alignItems: 'center',
        }}>
          <View style={{ maxWidth: 600, alignItems: 'center' }}>
            <Text style={{
              fontSize: getResponsiveValue(width, { mobile: 32, tablet: 40, desktop: 44, wide: 48 }),
              fontWeight: '700',
              color: BLACK,
              textAlign: 'center',
              marginBottom: getResponsiveSpacing(width, 24),
              fontFamily: 'Inter_700Bold',
              letterSpacing: -0.6,
            }}>
              Join the Movement
            </Text>
            <Text style={{
              fontSize: 20,
              color: GRAY,
              textAlign: 'center',
              marginBottom: 40,
              lineHeight: 30,
              fontFamily: 'Inter_400Regular',
            }}>
              Unlock the future of car modifications with TalonAI. Remember, this journey is just getting started.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: BLUE,
                paddingVertical: 18,
                paddingHorizontal: 36,
                borderRadius: 12,
                shadowColor: BLUE,
                shadowOpacity: 0.25,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              }}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={{
                color: WHITE,
                fontWeight: '600',
                fontSize: 18,
                fontFamily: 'Inter_600SemiBold',
                letterSpacing: -0.2,
              }}>
                Start now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={{
          paddingVertical: 40,
          paddingHorizontal: 24,
          backgroundColor: WHITE,
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        }}>
          <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
            <Text style={{
              color: GRAY,
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Inter_400Regular',
            }}>
              Copyright © 2025 TalonAI. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Native version (simplified)
  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingTop: NAVBAR_HEIGHT }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile Hero */}
        <View style={{
          paddingVertical: 60,
          paddingHorizontal: 24,
          alignItems: 'center',
          backgroundColor: WHITE,
        }}>
          <Text style={{
            fontSize: 40,
            fontWeight: '800',
            color: BLACK,
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 46,
            fontFamily: 'Inter_700Bold',
            letterSpacing: -0.5,
          }}>
            Everything App for your Car Modifications
          </Text>
          <Text style={{
            fontSize: 19,
            color: GRAY,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 28,
            fontFamily: 'Inter_400Regular',
          }}>
            TalonAI serves as an all-in-one replacement for traditional car modification advice and planning tools.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: BLUE,
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={{
              color: WHITE,
              fontWeight: '600',
              fontSize: 16,
              fontFamily: 'Inter_600SemiBold'
            }}>
              Try it Free
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <HulyNavbar navigation={navigation} scrollToFeatures={scrollToFeatures} scrollToTechnology={scrollToTechnology} />
    </View>
  );
};

// Technology Card Component
const TechnologyCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  const { width } = useWindowDimensions();
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: WHITE,
      borderRadius: 16,
      padding: getResponsiveSpacing(width, 32),
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadowColor: BLACK,
      shadowOpacity: 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      alignItems: 'center',
      minHeight: getResponsiveValue(width, { mobile: 200, tablet: 250, desktop: 280, wide: 300 }),
    }}>
      <Text style={{ fontSize: getResponsiveFontSize(width, 48), marginBottom: getResponsiveSpacing(width, 20) }}>{icon}</Text>
      <Text style={{
        fontSize: getResponsiveFontSize(width, 20),
        fontWeight: '700',
        color: BLACK,
        marginBottom: getResponsiveSpacing(width, 16),
        textAlign: 'center',
        fontFamily: 'Inter_700Bold',
        letterSpacing: -0.2,
      }}>
        {title}
      </Text>
      <Text style={{
        fontSize: getResponsiveFontSize(width, 16),
        color: GRAY,
        textAlign: 'center',
        lineHeight: getResponsiveValue(width, { mobile: 22, tablet: 24, desktop: 24, wide: 26 }),
        fontFamily: 'Inter_400Regular',
      }}>
        {description}
      </Text>
    </View>
  );
};

// Huly-style Feature Card
const HulyFeatureCard = ({ title, description, features }: { title: string; description: string; features: string[] }) => {
  const { width } = useWindowDimensions();
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: WHITE,
      borderRadius: 16,
      padding: getResponsiveSpacing(width, 32),
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadowColor: BLACK,
      shadowOpacity: 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      minHeight: getResponsiveValue(width, { mobile: 280, tablet: 320, desktop: 360, wide: 380 }),
    }}>
      <Text style={{
        fontSize: getResponsiveFontSize(width, 24),
        fontWeight: '700',
        color: BLACK,
        marginBottom: getResponsiveSpacing(width, 16),
        fontFamily: 'Inter_700Bold',
        letterSpacing: -0.3,
      }}>
        {title}
      </Text>
      <Text style={{
        fontSize: getResponsiveFontSize(width, 16),
        color: GRAY,
        marginBottom: getResponsiveSpacing(width, 24),
        lineHeight: getResponsiveValue(width, { mobile: 22, tablet: 24, desktop: 26, wide: 28 }),
        fontFamily: 'Inter_400Regular',
      }}>
        {description}
      </Text>
      {features.map((feature, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: getResponsiveSpacing(width, 10) }}>
          <View style={{
            width: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
            height: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
            borderRadius: 3,
            backgroundColor: BLUE,
            marginRight: getResponsiveSpacing(width, 12),
          }} />
          <Text style={{
            fontSize: getResponsiveFontSize(width, 15),
            color: DARK_GRAY,
            fontFamily: 'Inter_400Regular',
            lineHeight: getResponsiveValue(width, { mobile: 20, tablet: 22, desktop: 22, wide: 24 }),
          }}>
            {feature}
          </Text>
        </View>
      ))}
    </View>
  );
};

// Huly-style Navigation Bar
const HulyNavbar = ({ navigation, scrollToFeatures, scrollToTechnology }: any) => {
  const { isSignedIn } = useAuth();
  const { width } = useWindowDimensions();
  
  const handleChatNavigation = () => {
    if (isSignedIn) {
      navigation.navigate('Chat');
    } else {
      navigation.navigate('SignUp');
    }
  };

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={{
      height: NAVBAR_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: getResponsiveSpacing(width, 24),
      backgroundColor: WHITE,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}>
      {/* Logo */}
      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={handleLogoPress}
      >
        <Image
          source={require('./assets/logo.png')}
          style={{ width: 32, height: 32, borderRadius: 8, marginRight: 12 }}
          resizeMode="contain"
        />
        <Text style={{
          color: BLACK,
          fontWeight: '700',
          fontSize: getResponsiveFontSize(width, 22),
          fontFamily: 'Inter_700Bold',
          letterSpacing: -0.3,
        }}>
          TalonAI
        </Text>
      </TouchableOpacity>

      {/* Navigation Links - Hidden on mobile */}
      {getBreakpoint(width) !== 'mobile' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: getResponsiveSpacing(width, 32) }}>
          <TouchableOpacity onPress={() => scrollToFeatures && scrollToFeatures()}>
            <Text style={{ 
              color: DARK_GRAY, 
              fontSize: getResponsiveFontSize(width, 16), 
              fontWeight: '500', 
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.1,
            }}>
              Features
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToTechnology && scrollToTechnology()}>
            <Text style={{ 
              color: DARK_GRAY, 
              fontSize: getResponsiveFontSize(width, 16), 
              fontWeight: '500', 
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.1,
            }}>
              Technology
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChatNavigation}>
            <Text style={{ 
              color: DARK_GRAY, 
              fontSize: getResponsiveFontSize(width, 16), 
              fontWeight: '500', 
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.1,
            }}>
              Chat
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Auth Buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {!isSignedIn ? (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{
                color: DARK_GRAY,
                fontSize: 16,
                fontWeight: '500',
                fontFamily: 'Inter_600SemiBold',
                letterSpacing: -0.1,
              }}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: BLUE,
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 8,
                shadowColor: BLUE,
                shadowOpacity: 0.15,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={{
                color: WHITE,
                fontSize: 16,
                fontWeight: '500',
                fontFamily: 'Inter_600SemiBold',
                letterSpacing: -0.1,
              }}>
                Get Started
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: BLUE,
              paddingVertical: 10,
              paddingHorizontal: 18,
              borderRadius: 8,
              shadowColor: BLUE,
              shadowOpacity: 0.15,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={{
              color: WHITE,
              fontSize: 16,
              fontWeight: '500',
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.1,
            }}>
              Open Chat
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Legacy components (simplified for now)
const FeatureCard = ({ icon, title, descList }: { icon: string; title: string; descList: string[] }) => {
  const { width } = useWindowDimensions();
  
  return (
    <View style={{
      width: getResponsiveValue(width, { 
        mobile: width - 48, 
        tablet: 300, 
        desktop: 320, 
        wide: 340 
      }),
      backgroundColor: WHITE,
      borderRadius: 16,
      padding: getResponsiveSpacing(width, 24),
      margin: getResponsiveSpacing(width, 12),
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadowColor: BLACK,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <Text style={{ fontSize: getResponsiveFontSize(width, 32), marginBottom: getResponsiveSpacing(width, 16) }}>{icon}</Text>
      <Text style={{
        color: BLACK,
        fontSize: getResponsiveFontSize(width, 20),
        fontFamily: 'Inter_700Bold',
        marginBottom: getResponsiveSpacing(width, 12),
        lineHeight: getResponsiveValue(width, { mobile: 22, tablet: 24, desktop: 24, wide: 26 })
      }}>
        {title}
      </Text>
      {descList.map((desc, i) => (
        <Text key={i} style={{
          color: GRAY,
          fontSize: getResponsiveFontSize(width, 14),
          fontFamily: 'Inter_400Regular',
          marginBottom: getResponsiveSpacing(width, 6),
          lineHeight: getResponsiveValue(width, { mobile: 18, tablet: 20, desktop: 20, wide: 22 })
        }}>
          • {desc}
        </Text>
      ))}
    </View>
  );
};

// Keep other screens minimal for now
const LoginScreen = ({ navigation }: any) => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    setError('');
    
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        navigation.replace('Chat');
      } else {
        setError('Sign in incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.errors?.[0]?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
      <HulyNavbar navigation={navigation} />
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: getResponsiveSpacing(width, 24),
        paddingTop: NAVBAR_HEIGHT,
      }}>
        <View style={{
          backgroundColor: WHITE,
          borderRadius: 16,
          padding: getResponsiveSpacing(width, 40),
          width: '100%',
          maxWidth: getResponsiveValue(width, { mobile: 350, tablet: 400, desktop: 450, wide: 500 }),
          shadowColor: BLACK,
          shadowOpacity: 0.05,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          borderWidth: 1,
          borderColor: '#e2e8f0',
        }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: getResponsiveSpacing(width, 32) }}>
            <Text style={{
              fontSize: getResponsiveFontSize(width, 28),
              fontWeight: '700',
              color: BLACK,
              marginBottom: getResponsiveSpacing(width, 8),
              fontFamily: 'Inter_700Bold',
            }}>
              Welcome back
            </Text>
            <Text style={{
              fontSize: getResponsiveFontSize(width, 16),
              color: GRAY,
              textAlign: 'center',
              fontFamily: 'Inter_400Regular',
            }}>
              Sign in to your TalonAI account
            </Text>
          </View>

          {/* Form */}
          <View style={{ marginBottom: getResponsiveSpacing(width, 24) }}>
            <Text style={{
              fontSize: getResponsiveFontSize(width, 14),
              fontWeight: '500',
              color: DARK_GRAY,
              marginBottom: getResponsiveSpacing(width, 8),
              fontFamily: 'Inter_600SemiBold',
            }}>
              Email
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={GRAY}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                backgroundColor: WHITE,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                padding: getResponsiveSpacing(width, 12),
                fontSize: getResponsiveFontSize(width, 16),
                color: BLACK,
                fontFamily: 'Inter_400Regular',
                marginBottom: getResponsiveSpacing(width, 16),
              }}
            />
            
            <Text style={{
              fontSize: getResponsiveFontSize(width, 14),
              fontWeight: '500',
              color: DARK_GRAY,
              marginBottom: getResponsiveSpacing(width, 8),
              fontFamily: 'Inter_600SemiBold',
            }}>
              Password
            </Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={GRAY}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{
                backgroundColor: WHITE,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                padding: getResponsiveSpacing(width, 12),
                fontSize: getResponsiveFontSize(width, 16),
                color: BLACK,
                fontFamily: 'Inter_400Regular',
              }}
            />
          </View>

          {error ? (
            <View style={{
              backgroundColor: '#fef2f2',
              borderWidth: 1,
              borderColor: '#fecaca',
              borderRadius: 8,
              padding: getResponsiveSpacing(width, 12),
              marginBottom: getResponsiveSpacing(width, 24),
            }}>
              <Text style={{
                color: '#dc2626',
                fontSize: getResponsiveFontSize(width, 14),
                textAlign: 'center',
                fontFamily: 'Inter_400Regular',
              }}>
                {error}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={{
              backgroundColor: loading ? GRAY : BLUE,
              paddingVertical: getResponsiveSpacing(width, 12),
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: getResponsiveSpacing(width, 16),
              shadowColor: BLUE,
              shadowOpacity: loading ? 0 : 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: loading ? 0 : 4,
            }}
            onPress={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
          >
            <Text style={{
              color: WHITE,
              fontSize: getResponsiveFontSize(width, 16),
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={{ alignItems: 'center' }}
          >
            <Text style={{
              color: GRAY,
              fontSize: getResponsiveFontSize(width, 14),
              fontFamily: 'Inter_400Regular',
            }}>
              Don't have an account?{' '}
              <Text style={{ color: BLUE, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
                Sign up
              </Text>
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
  const { width } = useWindowDimensions();

  const handleSignUp = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    setError('');
    
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.errors?.[0]?.message || err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    setError('');
    
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        navigation.replace('Chat');
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || err.message || 'Verification failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
      <HulyNavbar navigation={navigation} />
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: getResponsiveSpacing(width, 24),
        paddingTop: NAVBAR_HEIGHT,
      }}>
        <View style={{
          backgroundColor: WHITE,
          borderRadius: 16,
          padding: getResponsiveSpacing(width, 40),
          width: '100%',
          maxWidth: getResponsiveValue(width, { mobile: 350, tablet: 400, desktop: 450, wide: 500 }),
          shadowColor: BLACK,
          shadowOpacity: 0.05,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          borderWidth: 1,
          borderColor: '#e2e8f0',
        }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: getResponsiveSpacing(width, 32) }}>
            <Text style={{
              fontSize: getResponsiveFontSize(width, 28),
              fontWeight: '700',
              color: BLACK,
              marginBottom: getResponsiveSpacing(width, 8),
              fontFamily: 'Inter_700Bold',
            }}>
              {pendingVerification ? 'Verify your email' : 'Get started'}
            </Text>
            <Text style={{
              fontSize: getResponsiveFontSize(width, 16),
              color: GRAY,
              textAlign: 'center',
              fontFamily: 'Inter_400Regular',
            }}>
              {pendingVerification 
                ? 'Enter the verification code sent to your email'
                : 'Create your TalonAI account'
              }
            </Text>
          </View>

          {/* Form */}
          {!pendingVerification ? (
            <View style={{ marginBottom: getResponsiveSpacing(width, 24) }}>
              <Text style={{
                fontSize: getResponsiveFontSize(width, 14),
                fontWeight: '500',
                color: DARK_GRAY,
                marginBottom: getResponsiveSpacing(width, 8),
                fontFamily: 'Inter_600SemiBold',
              }}>
                Email
              </Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={GRAY}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  backgroundColor: WHITE,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 8,
                  padding: getResponsiveSpacing(width, 12),
                  fontSize: getResponsiveFontSize(width, 16),
                  color: BLACK,
                  fontFamily: 'Inter_400Regular',
                  marginBottom: getResponsiveSpacing(width, 16),
                }}
              />
              
              <Text style={{
                fontSize: getResponsiveFontSize(width, 14),
                fontWeight: '500',
                color: DARK_GRAY,
                marginBottom: getResponsiveSpacing(width, 8),
                fontFamily: 'Inter_600SemiBold',
              }}>
                Password
              </Text>
              <TextInput
                placeholder="Create a password (min 8 characters)"
                placeholderTextColor={GRAY}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  backgroundColor: WHITE,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 8,
                  padding: getResponsiveSpacing(width, 12),
                  fontSize: getResponsiveFontSize(width, 16),
                  color: BLACK,
                  fontFamily: 'Inter_400Regular',
                }}
              />
            </View>
          ) : (
            <View style={{ marginBottom: getResponsiveSpacing(width, 24) }}>
              <Text style={{
                fontSize: getResponsiveFontSize(width, 14),
                fontWeight: '500',
                color: DARK_GRAY,
                marginBottom: getResponsiveSpacing(width, 8),
                fontFamily: 'Inter_600SemiBold',
              }}>
                Verification Code
              </Text>
              <TextInput
                placeholder="Enter 6-digit code"
                placeholderTextColor={GRAY}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={{
                  backgroundColor: WHITE,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 8,
                  padding: getResponsiveSpacing(width, 12),
                  fontSize: getResponsiveFontSize(width, 16),
                  color: BLACK,
                  fontFamily: 'Inter_400Regular',
                  textAlign: 'center',
                  letterSpacing: 2,
                }}
                maxLength={6}
              />
            </View>
          )}

          {error ? (
            <View style={{
              backgroundColor: '#fef2f2',
              borderWidth: 1,
              borderColor: '#fecaca',
              borderRadius: 8,
              padding: getResponsiveSpacing(width, 12),
              marginBottom: getResponsiveSpacing(width, 24),
            }}>
              <Text style={{
                color: '#dc2626',
                fontSize: getResponsiveFontSize(width, 14),
                textAlign: 'center',
                fontFamily: 'Inter_400Regular',
              }}>
                {error}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={{
              backgroundColor: loading ? GRAY : BLUE,
              paddingVertical: getResponsiveSpacing(width, 12),
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: getResponsiveSpacing(width, 16),
              shadowColor: BLUE,
              shadowOpacity: loading ? 0 : 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: loading ? 0 : 4,
            }}
            onPress={pendingVerification ? handleVerify : handleSignUp}
            disabled={loading || (!pendingVerification && (!email.trim() || !password.trim() || password.length < 8)) || (pendingVerification && code.length !== 6)}
          >
            <Text style={{
              color: WHITE,
              fontSize: getResponsiveFontSize(width, 16),
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
            }}>
              {loading 
                ? (pendingVerification ? 'Verifying...' : 'Creating account...')
                : (pendingVerification ? 'Verify Email' : 'Create Account')
              }
            </Text>
          </TouchableOpacity>

          {!pendingVerification && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ alignItems: 'center' }}
            >
              <Text style={{
                color: GRAY,
                fontSize: getResponsiveFontSize(width, 14),
                fontFamily: 'Inter_400Regular',
              }}>
                Already have an account?{' '}
                <Text style={{ color: BLUE, fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
                  Sign in
                </Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

const ChatScreen = ({ navigation }: any) => {
  const { userId, isSignedIn } = useAuth();
  const { width } = useWindowDimensions();
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [sessionsLoaded, setSessionsLoaded] = React.useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(false);
  const scrollViewRef = React.useRef<any>(null);
  const inputRef = React.useRef<any>(null);

  // Don't load sessions automatically - wait for user interaction
  React.useEffect(() => {
    if (userId && !sessionsLoaded && showSidebar) {
      loadUserSessions();
    }
  }, [userId, showSidebar, sessionsLoaded]);

  const loadUserSessions = async () => {
    if (isLoadingSessions) return; // Prevent multiple simultaneous loads
    
    console.log('Loading user sessions for userId:', userId);
    setIsLoadingSessions(true);
    
    try {
      const url = `${CHAT_BACKEND_URL}/api/sessions/${userId}`;
      console.log('GET Sessions URL:', url);
      
      const response = await fetch(url);
      console.log('Sessions response status:', response.status);
      
      if (response.ok) {
        const sessionsData = await response.json();
        console.log('Raw sessions data:', sessionsData);
        
        const sessionsWithDates = sessionsData.map((session: any) => ({
          id: session.sessionId,
          title: session.title || 'New Chat',
          messages: [], // Don't load messages here, only load when clicking on session
          lastUpdated: new Date(session.lastUpdated || session.createdAt)
        }));
        
        console.log('Processed sessions:', sessionsWithDates);
        setSessions(sessionsWithDates);
        setSessionsLoaded(true);
        setError(''); // Clear any previous errors
      } else {
        const errorText = await response.text();
        console.error('Failed to load sessions:', errorText);
        // Don't throw error, just log it and show empty state
        setSessions([]);
        setSessionsLoaded(true);
      }
    } catch (error: any) {
      console.error('Error loading sessions:', error);
      // Don't crash the app, just show empty sessions
      setSessions([]);
      setSessionsLoaded(true);
      // Only show error if it's not a connection issue
      if (!error.message?.includes('Failed to fetch') && !error.message?.includes('NetworkError')) {
        setError('Unable to load previous chats');
      }
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const createNewSession = async () => {
    const newSessionId = generateSessionId();
    console.log('Creating new session:', { userId, sessionId: newSessionId });
    
    try {
      const url = `${CHAT_BACKEND_URL}/api/sessions/${userId}`;
      console.log('POST URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: newSessionId,
          title: 'New Chat'
        }),
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (response.ok) {
        const responseData = JSON.parse(responseText);
        const newSession: ChatSession = {
          id: newSessionId,
          title: 'New Chat',
          messages: [],
          lastUpdated: new Date()
        };
        
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSessionId);
        setMessages([]);
        setError('');
        setShowSidebar(false);
        console.log('Session created successfully');
      } else {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: responseText };
        }
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error creating session:', error);
      // Still create a local session even if server fails
      const newSession: ChatSession = {
        id: newSessionId,
        title: 'New Chat',
        messages: [],
        lastUpdated: new Date()
      };
      
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSessionId);
      setMessages([]);
      setShowSidebar(false);
      
      // Show a warning but don't prevent chat
      if (!error.message?.includes('Failed to fetch')) {
        setError('Chat will work but may not save to cloud');
      }
    }
  };

  const loadSession = async (sessionId: string) => {
    console.log('Loading session:', sessionId);
    setError('');
    
    try {
      const url = `${CHAT_BACKEND_URL}/api/sessions/${userId}/${sessionId}`;
      console.log('GET URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const sessionData = await response.json();
        console.log('Session data:', sessionData);
        
        const messagesWithDates = (sessionData.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        setCurrentSessionId(sessionId);
        setMessages(messagesWithDates);
        setError('');
        setShowSidebar(false);
        console.log('Session loaded successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to load session:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error: any) {
      console.error('Error loading session:', error);
      // Still switch to the session even if loading fails
      setCurrentSessionId(sessionId);
      setMessages([]);
      setShowSidebar(false);
      
      // Only show error for non-network issues
      if (!error.message?.includes('Failed to fetch')) {
        setError('Unable to load chat history');
      }
    }
  };

  const updateCurrentSession = async (newMessages: ChatMessage[]) => {
    if (!currentSessionId) return;
    
    console.log('Updating session:', currentSessionId, 'with', newMessages.length, 'messages');
    
    try {
      // Generate title from first user message if still "New Chat"
      const currentSession = sessions.find(s => s.id === currentSessionId);
      let title = currentSession?.title || 'New Chat';
      if (title === 'New Chat' && newMessages.length > 0) {
        const firstUserMessage = newMessages.find(m => m.sender === 'user');
        if (firstUserMessage) {
          title = firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
        }
      }
      
      const url = `${CHAT_BACKEND_URL}/api/sessions/${userId}/${currentSessionId}`;
      console.log('PUT URL:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          title: title
        }),
      });
      
      console.log('Update response status:', response.status);
      
      if (response.ok) {
        // Update local sessions list
        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              title,
              messages: newMessages,
              lastUpdated: new Date()
            };
          }
          return session;
        }));
        console.log('Session updated successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to update session:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error: any) {
      console.error('Error updating session:', error);
      setError(`Failed to update session: ${error.message}`);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;
    
    // Create new session if none exists
    if (!currentSessionId) {
      await createNewSession();
      return; // Wait for session to be created, then user can send message again
    }
    
    const newMessage: ChatMessage = { sender: 'user', text: input.trim(), timestamp: new Date() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError('');
    const userMessage = input;
    setInput('');
    
    try {
      const response = await fetch(`${CHAT_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          user_id: userId,
          session_id: currentSessionId,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `Server error: ${response.status}` };
        }
        throw new Error(errorData.error || 'Request failed');
      }
      
      const data = await response.json();
      
      // Simple response handling - just display whatever the backend returns
      let agentMessage = '';
      if (data.final_message) {
        agentMessage = data.final_message;
      } else if (data.message) {
        agentMessage = data.message;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        // Fallback for any other response format
        agentMessage = JSON.stringify(data);
      }
      
      const agentResponse: ChatMessage = { 
        sender: 'agent', 
        text: agentMessage, 
        timestamp: new Date() 
      };
      
      const finalMessages = [...updatedMessages, agentResponse];
      setMessages(finalMessages);
      await updateCurrentSession(finalMessages);
      
    } catch (err: any) {
      let errorMessage = 'Error sending message';
      let agentResponse = 'Sorry, there was an error processing your request. Please try again.';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error - please check your connection';
        agentResponse = 'I\'m having trouble connecting to the server. Please check your internet connection and try again.';
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied';
        agentResponse = 'Access denied. Please make sure you\'re using the official TalonAI app.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error';
        agentResponse = 'The server is experiencing issues. Please try again in a few moments.';
      } else if (err.message) {
        errorMessage = err.message;
        agentResponse = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      const errorMsg: ChatMessage = { 
        sender: 'agent', 
        text: agentResponse, 
        timestamp: new Date() 
      };
      
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      await updateCurrentSession(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web') {
      // Handle Enter key to send message
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() && !loading) {
          sendMessage();
        }
      }
    }
  };

  const handleSubmitEditing = () => {
    if (Platform.OS !== 'web') {
      sendMessage();
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      // Confirmation (web only, native TODO)
      if (Platform.OS === 'web' && !window.confirm('Delete this chat?')) return;

      const url = `${CHAT_BACKEND_URL}/api/sessions/${userId}/${sessionId}`;
      await fetch(url, { method: 'DELETE' });

      // Remove locally
      setSessions(prev => prev.filter(s => s.id !== sessionId));

      // If currently viewing this session, clear view
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting session', err);
      setError('Failed to delete chat. Please try again.');
    }
  };

  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a1026' }}>
        <HulyNavbar navigation={navigation} />
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: getResponsiveSpacing(width, 24),
          paddingTop: NAVBAR_HEIGHT,
        }}>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 16,
            padding: getResponsiveSpacing(width, 32),
            alignItems: 'center',
            maxWidth: getResponsiveValue(width, { mobile: 320, tablet: 400, desktop: 450, wide: 500 }),
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}>
            <Text style={{
              fontSize: getResponsiveFontSize(width, 24),
              fontWeight: '700',
              color: WHITE,
              marginBottom: getResponsiveSpacing(width, 12),
              textAlign: 'center',
              fontFamily: 'Inter_700Bold',
            }}>
              Sign in required
            </Text>
            <Text style={{
              fontSize: getResponsiveFontSize(width, 16),
              color: '#94a3b8',
              textAlign: 'center',
              marginBottom: getResponsiveSpacing(width, 24),
              fontFamily: 'Inter_400Regular',
            }}>
              Please sign in to chat with TalonAI
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#3b82f6',
                paddingVertical: getResponsiveSpacing(width, 12),
                paddingHorizontal: getResponsiveSpacing(width, 24),
                borderRadius: 8,
              }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={{
                color: WHITE,
                fontSize: getResponsiveFontSize(width, 16),
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold',
              }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0a1026' }}>
      <HulyNavbar navigation={navigation} />
      
      <View style={{ flex: 1, flexDirection: 'row', paddingTop: NAVBAR_HEIGHT }}>
        {/* Sidebar */}
        {(showSidebar || getBreakpoint(width) !== 'mobile') && (
          <View style={{
            width: getResponsiveValue(width, { 
              mobile: '90%', 
              tablet: '50%', 
              desktop: 280, 
              wide: 320 
            }),
            backgroundColor: '#142042',
            borderRightWidth: 1,
            borderRightColor: 'rgba(255, 255, 255, 0.1)',
            position: getBreakpoint(width) === 'mobile' ? 'absolute' : 'relative',
            height: '100%',
            zIndex: 1000,
          }}>
            {/* Sidebar Header */}
            <View style={{
              paddingVertical: getResponsiveSpacing(width, 20),
              paddingHorizontal: getResponsiveSpacing(width, 24),
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255, 255, 255, 0.1)',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: getResponsiveFontSize(width, 18),
                fontWeight: '600',
                color: WHITE,
                fontFamily: 'Inter_600SemiBold',
              }}>
                Chat History
              </Text>
              <TouchableOpacity
                onPress={createNewSession}
                style={{
                  backgroundColor: '#3b82f6',
                  paddingVertical: getResponsiveSpacing(width, 8),
                  paddingHorizontal: getResponsiveSpacing(width, 16),
                  borderRadius: 6,
                }}
              >
                <Text style={{
                  color: WHITE,
                  fontSize: getResponsiveFontSize(width, 14),
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold',
                }}>
                  New
                </Text>
              </TouchableOpacity>
            </View>

            {/* Chat Sessions List */}
            <ScrollView style={{ flex: 1, paddingVertical: getResponsiveSpacing(width, 8) }}>
              {!sessionsLoaded && !isLoadingSessions && (
                <TouchableOpacity
                  onPress={loadUserSessions}
                  style={{
                    margin: getResponsiveSpacing(width, 16),
                    padding: getResponsiveSpacing(width, 12),
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    color: '#3b82f6',
                    fontSize: getResponsiveFontSize(width, 14),
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                  }}>
                    Load Previous Chats
                  </Text>
                </TouchableOpacity>
              )}
              
              {isLoadingSessions && (
                <View style={{ paddingVertical: getResponsiveSpacing(width, 40), alignItems: 'center' }}>
                  <Text style={{
                    fontSize: getResponsiveFontSize(width, 14),
                    color: '#64748b',
                    fontFamily: 'Inter_400Regular',
                  }}>
                    Loading chats...
                  </Text>
                </View>
              )}
              
              {sessionsLoaded && sessions.map((session, index) => (
                <View
                  key={session.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: getResponsiveSpacing(width, 8),
                    marginVertical: getResponsiveSpacing(width, 2),
                    borderRadius: 8,
                    backgroundColor: currentSessionId === session.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => loadSession(session.id)}
                    style={{
                      flex: 1,
                      paddingVertical: getResponsiveSpacing(width, 12),
                      paddingHorizontal: getResponsiveSpacing(width, 16),
                    }}
                  >
                    <Text style={{
                      fontSize: getResponsiveFontSize(width, 14),
                      fontWeight: currentSessionId === session.id ? '600' : '400',
                      color: currentSessionId === session.id ? WHITE : '#94a3b8',
                      fontFamily: currentSessionId === session.id ? 'Inter_600SemiBold' : 'Inter_400Regular',
                      marginBottom: getResponsiveSpacing(width, 4),
                    }}>
                      {session.title}
                    </Text>
                    <Text style={{
                      fontSize: getResponsiveFontSize(width, 12),
                      color: '#64748b',
                      fontFamily: 'Inter_400Regular',
                    }}>
                      {session.lastUpdated.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteSession(session.id)}
                    style={{ 
                      paddingHorizontal: getResponsiveSpacing(width, 12), 
                      paddingVertical: getResponsiveSpacing(width, 12),
                    }}
                  >
                    <Text style={{ fontSize: getResponsiveFontSize(width, 16), color: '#ef4444' }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {sessionsLoaded && sessions.length === 0 && (
                <View style={{ paddingVertical: getResponsiveSpacing(width, 40), alignItems: 'center' }}>
                  <Text style={{
                    fontSize: getResponsiveFontSize(width, 14),
                    color: '#64748b',
                    fontFamily: 'Inter_400Regular',
                    textAlign: 'center',
                  }}>
                    No chat history yet.{'\n'}Start a new conversation!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Chat Container */}
        <View style={{ 
          flex: 1,
          backgroundColor: '#0a1026',
        }}>
          {/* Chat Header */}
          <View style={{
            paddingVertical: getResponsiveSpacing(width, 20),
            paddingHorizontal: getResponsiveSpacing(width, 24),
            backgroundColor: '#142042',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {getBreakpoint(width) === 'mobile' && (
                <TouchableOpacity
                  onPress={() => setShowSidebar(!showSidebar)}
                  style={{
                    marginRight: getResponsiveSpacing(width, 12),
                    padding: getResponsiveSpacing(width, 8),
                  }}
                >
                  <Text style={{ fontSize: getResponsiveFontSize(width, 18), color: '#94a3b8' }}>☰</Text>
                </TouchableOpacity>
              )}
              <View>
                <Text style={{
                  fontSize: getResponsiveFontSize(width, 24),
                  fontWeight: '700',
                  color: WHITE,
                  fontFamily: 'Inter_700Bold',
                }}>
                  TalonAI
                </Text>
                <Text style={{
                  fontSize: getResponsiveFontSize(width, 14),
                  color: '#94a3b8',
                  fontFamily: 'Inter_400Regular',
                }}>
                  Your AI car modification expert
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={createNewSession}
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                paddingVertical: getResponsiveSpacing(width, 8),
                paddingHorizontal: getResponsiveSpacing(width, 16),
                borderRadius: 6,
                borderWidth: 1,
                borderColor: 'rgba(59, 130, 246, 0.3)',
              }}
            >
              <Text style={{
                color: '#3b82f6',
                fontSize: getResponsiveFontSize(width, 14),
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold',
              }}>
                New chat
              </Text>
            </TouchableOpacity>
          </View>

        {/* Messages Area */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }} 
          contentContainerStyle={{ 
            paddingVertical: getResponsiveSpacing(width, 20),
            paddingHorizontal: getResponsiveSpacing(width, 24),
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: getResponsiveSpacing(width, 60),
            }}>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 16,
                padding: getResponsiveSpacing(width, 32),
                alignItems: 'center',
                maxWidth: getResponsiveValue(width, { mobile: 320, tablet: 400, desktop: 450, wide: 500 }),
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}>
                <Text style={{
                  fontSize: getResponsiveFontSize(width, 20),
                  fontWeight: '600',
                  color: WHITE,
                  marginBottom: getResponsiveSpacing(width, 12),
                  fontFamily: 'Inter_600SemiBold',
                  textAlign: 'center',
                }}>
                  Welcome to TalonAI! 👋
                </Text>
                <Text style={{
                  fontSize: getResponsiveFontSize(width, 16),
                  color: '#94a3b8',
                  textAlign: 'center',
                  lineHeight: getResponsiveValue(width, { mobile: 22, tablet: 24, desktop: 24, wide: 26 }),
                  fontFamily: 'Inter_400Regular',
                }}>
                  I'm your AI car modification expert. Just tell me about your car, what you want to achieve, or any issues you're having - I'll learn about your setup as we chat!
                </Text>
              </View>
            </View>
          )}

          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={{
                marginVertical: getResponsiveSpacing(width, 8),
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <View style={{
                backgroundColor: msg.sender === 'user' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
                paddingVertical: getResponsiveSpacing(width, 12),
                paddingHorizontal: getResponsiveSpacing(width, 16),
                maxWidth: getResponsiveValue(width, { mobile: '90%', tablet: '85%', desktop: '80%', wide: '75%' }),
                borderWidth: msg.sender === 'agent' ? 1 : 0,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}>
                <Text style={{
                  color: msg.sender === 'user' ? WHITE : '#e2e8f0',
                  fontSize: getResponsiveFontSize(width, 16),
                  lineHeight: getResponsiveValue(width, { mobile: 22, tablet: 24, desktop: 24, wide: 26 }),
                  fontFamily: 'Inter_400Regular',
                }}>
                  {msg.text}
                </Text>
              </View>
              <Text style={{
                fontSize: getResponsiveFontSize(width, 12),
                color: '#64748b',
                marginTop: getResponsiveSpacing(width, 4),
                marginHorizontal: getResponsiveSpacing(width, 16),
                fontFamily: 'Inter_400Regular',
              }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}

          {loading && (
            <View style={{
              marginVertical: getResponsiveSpacing(width, 8),
              alignItems: 'flex-start',
            }}>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
                paddingVertical: getResponsiveSpacing(width, 12),
                paddingHorizontal: getResponsiveSpacing(width, 16),
                maxWidth: getResponsiveValue(width, { mobile: '90%', tablet: '85%', desktop: '80%', wide: '75%' }),
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: getResponsiveSpacing(width, 8),
                }}>
                  <View style={{
                    width: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
                    height: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
                    borderRadius: 3,
                    backgroundColor: '#3b82f6',
                    marginRight: getResponsiveSpacing(width, 4),
                  }} />
                  <View style={{
                    width: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
                    height: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
                    borderRadius: 3,
                    backgroundColor: '#60a5fa',
                    marginRight: getResponsiveSpacing(width, 4),
                  }} />
                  <View style={{
                    width: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
                    height: getResponsiveValue(width, { mobile: 5, tablet: 6, desktop: 6, wide: 7 }),
                    borderRadius: 3,
                    backgroundColor: '#93c5fd',
                  }} />
                </View>
                <Text style={{
                  color: '#94a3b8',
                  fontSize: getResponsiveFontSize(width, 16),
                  fontStyle: 'italic',
                  fontFamily: 'Inter_400Regular',
                }}>
                  TalonAI is thinking...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {error ? (
          <View style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(239, 68, 68, 0.3)',
            margin: getResponsiveSpacing(width, 16),
            padding: getResponsiveSpacing(width, 12),
            borderRadius: 8,
          }}>
            <Text style={{
              color: '#f87171',
              fontSize: getResponsiveFontSize(width, 14),
              textAlign: 'center',
              fontFamily: 'Inter_400Regular',
            }}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Input Area */}
        <View style={{
          backgroundColor: '#142042',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          paddingHorizontal: getResponsiveSpacing(width, 16),
          paddingVertical: getResponsiveSpacing(width, 16),
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            paddingHorizontal: getResponsiveSpacing(width, 16),
            paddingVertical: getResponsiveSpacing(width, 8),
            maxHeight: getResponsiveValue(width, { mobile: 100, tablet: 120, desktop: 120, wide: 140 }),
          }}>
            <TextInput
              ref={inputRef}
              style={{
                flex: 1,
                fontSize: getResponsiveFontSize(width, 16),
                color: WHITE,
                fontFamily: 'Inter_400Regular',
                paddingVertical: getResponsiveSpacing(width, 8),
                paddingHorizontal: 0,
                maxHeight: getResponsiveValue(width, { mobile: 80, tablet: 100, desktop: 100, wide: 120 }),
              }}
              placeholder="Ask about car modifications, builds, or troubleshooting..."
              placeholderTextColor="#64748b"
              value={input}
              onChangeText={setInput}
              editable={!loading}
              onSubmitEditing={handleSubmitEditing}
              onKeyPress={handleKeyPress}
              returnKeyType="send"
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: loading || !input.trim() ? 'rgba(100, 116, 139, 0.3)' : '#3b82f6',
                padding: getResponsiveSpacing(width, 10),
                borderRadius: 8,
                marginLeft: getResponsiveSpacing(width, 8),
              }}
            >
              <Text style={{
                color: WHITE,
                fontSize: getResponsiveFontSize(width, 16),
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold',
              }}>
                →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </View>
    </View>
  );
};

// Token cache and session management
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9);
}

const CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY || 
  'pk_test_dml0YWwtb3Jpb2xlLTI5LmNsZXJrLmFjY291bnRzLmRldiQ';
const CHAT_BACKEND_URL = process.env.CHAT_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '' // Use relative URLs for production
    : (Platform.OS === 'web' ? '' : 'http://localhost:3000')); // Use relative URLs for local web development

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </ClerkProvider>
  );
}
