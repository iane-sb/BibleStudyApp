import re

with open('mobile/src/app/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the verse block by its stable markers
start_marker = '        {/* DAILY VERSE */}'
end_marker   = '\n\n        {/* CONTINUE READING */}'

start_idx = content.find(start_marker)
end_idx   = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print('ERROR: markers not found', 'start=', start_idx, 'end=', end_idx)
    exit(1)

old_block = content[start_idx:end_idx]
print('OLD BLOCK length:', len(old_block))
print('OLD BLOCK preview:', repr(old_block[:120]))

new_block = '''        {/* DAILY VERSE */}
        <Animated.View style={[styles.verseCard, { opacity: fadeAnim }]}>
          <View style={styles.verseTop}>
            <Text style={styles.verseEyebrow}>\u2726 VERSE OF THE DAY</Text>
            <View style={styles.verseTopRight}>
              <Text style={styles.verseDate}>{dateLabel}</Text>
              {__DEV__ && (
                <Pressable
                  onPress={handleSimulateRotate}
                  style={styles.devBtn}
                  accessibilityLabel="Simulate verse rotation"
                >
                  <Ionicons name="refresh-circle-outline" size={16} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
          </View>

          <Text style={styles.quoteMark}>\u201c</Text>

          {verseLoading || !verse ? (
            <Text style={styles.verseText}>Loading today\u2019s verse\u2026</Text>
          ) : (
            <>
              <Text style={styles.verseText}>{verse.text}</Text>
              <Text style={styles.verseReference}>
                {verse.reference.toUpperCase()} \u00b7 {verse.translation}
              </Text>
              {verse.themeLabel ? (
                <Text style={styles.verseThemeTag}>\u2726 {verse.themeLabel.toUpperCase()}</Text>
              ) : null}
            </>
          )}

          <View style={styles.verseDivider} />

          <View style={styles.verseFooter}>
            <View style={styles.verseActions}>
              <Pressable
                style={styles.verseActionBtn}
                onPress={toggleBookmark}
                accessibilityLabel={isBookmarked ? "Remove bookmark" : "Bookmark verse"}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={isBookmarked ? colors.gold : colors.textSecondary}
                />
              </Pressable>
              <Pressable
                style={styles.verseActionBtn}
                onPress={handleShareVerse}
                accessibilityLabel="Share verse"
              >
                <Ionicons
                  name="share-social-outline"
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.readButton}
              onPress={() =>
                verse
                  ? router.push({
                      pathname: "/bible",
                      params: {
                        book: verse.bookCode,
                        chapter: String(verse.chapter),
                        translation: verse.translation,
                      },
                    } as any)
                  : router.push({ pathname: "/bible" } as any)
              }
            >
              <Text style={styles.readButtonText}>Read in Bible \u2192</Text>
            </Pressable>
          </View>
        </Animated.View>'''

content = content[:start_idx] + new_block + content[end_idx:]

with open('mobile/src/app/index.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print('DONE. Patched successfully.')
