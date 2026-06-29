import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { WebView } from 'react-native-webview';

function buildHtml(url: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe
    src="${url}"
    allowfullscreen
    allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *"
    scrolling="no"
    frameborder="0"
  ></iframe>
</body>
</html>`;
}

export default function PlayerScreen() {
  const { id, type, season, episode } = useLocalSearchParams<{
    id: string;
    type: 'filme' | 'serie';
    season?: string;
    episode?: string;
  }>();

  let url = '';
  if (type === 'serie' && season && episode) {
    url = `https://myembed.biz/serie/${id}/${season}/${episode}`;
  } else if (type === 'serie') {
    url = `https://myembed.biz/serie/${id}`;
  } else {
    url = `https://myembed.biz/filme/${id}`;
  }

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Esconde a barra de status completamente no player
      StatusBar.setHidden(true, 'fade');
    }
    return () => {
      if (Platform.OS !== 'web') {
        // Restaura ao sair do player
        StatusBar.setHidden(false, 'fade');
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('transparent');
      }
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <iframe
          src={url}
          style={{ flex: 1, border: 'none', width: '100%', height: '100%' } as any}
          allow="autoplay *; encrypted-media *; fullscreen *"
          allowFullScreen
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <WebView
        source={{ html: buildHtml(url) }}
        style={styles.webview}
        originWhitelist={['*']}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        startInLoadingState
        mixedContentMode="always"
        injectedJavaScript={`
          (function() {
            document.addEventListener('click', function(e) {
              var el = e.target;
              while (el && el.tagName !== 'A') el = el.parentElement;
              if (el && el.href) {
                var url = el.href;
                if (!url.includes('myembed.biz') && !url.includes('embedmovies.org') && !url.startsWith('blob:') && !url.startsWith('about:')) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }
            }, true);
            window.open = function() { return null; };
          })();
        `}
        onShouldStartLoadWithRequest={request => {
          const url = request.url;
          if (
            url.startsWith('intent://') ||
            url.startsWith('market://') ||
            url.startsWith('whatsapp://') ||
            url.startsWith('tel:') ||
            url.startsWith('mailto:')
          ) {
            return false;
          }
          return true;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#000' },
  backButton: {
    position: 'absolute', top: 16, left: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  backIcon:   { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  webview:    { flex: 1 },
});