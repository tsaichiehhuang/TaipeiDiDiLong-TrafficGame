/**
 * Section manager
 * 負責 Section 的開始與切換
 */
const SectionManager = (gameManager) => {

    const section1 = Section1();
    const section2 = Section2();
    const section3 = Section3();
    const section4 = Section4();
    const section5 = Section5();
    const sections = [section1, section2, section3, section4, section5];

    const startFirstSection = () => {
        sections[0].onSectionStart();
    };

    const onSectionChanged = (oldSection, newSection) => {
        sections[oldSection - 1].onSectionEnd();
        sections[newSection - 1].onSectionStart();
    };

    const drawSections = () => {
        // Draw always, ignore current section
        sections.forEach(section => {
            section.drawAlways();
        });

        // Draw during section of current section
        if (gameManager.getSection() >= sections.length) return;
        sections[gameManager.getSection() - 1].drawDuringSection();
    };

    return {
        onSectionChanged,
        drawSections,
        startFirstSection
    };
};