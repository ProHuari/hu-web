import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'motion/react';

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
};

const gridVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.055,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 340,
            damping: 28,
        },
    },
};

export function PageTransition({ children, className = '' }) {
    return (
        <motion.div
            className={className}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

PageTransition.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export function StaggerGrid({ children, className = '' }) {
    return (
        <motion.div
            className={className}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
}

StaggerGrid.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export function StaggerItem({ children, className = '' }) {
    return (
        <motion.div className={className} variants={itemVariants}>
            {children}
        </motion.div>
    );
}

StaggerItem.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

